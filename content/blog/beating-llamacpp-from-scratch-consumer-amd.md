---
title: "Beating llama.cpp from Scratch on Consumer AMD: Building Strata, a Native Rust + HIP Local AI Engine"
description: "Software Architect Mihai Farcas details engineering Strata: an ultra-fast local LLM inference engine for Qwen 3.5 on AMD Radeon RX 7900 XTX (gfx1100). How custom HIP kernels, split-KV reduction, and zero-allocation Rust beat llama.cpp and Ollama at 83.0 tok/s BF16 decode."
date: "2026-10-08"
type: "blog_post"
tags:
  [
    "local-llm",
    "local-ai",
    "rust",
    "rocm",
    "amd",
    "gpu-kernels",
    "systems-engineering",
    "cuda",
    "qwen",
    "strata",
    "mihai-farcas",
    "ai-infrastructure",
  ]
cover_image: "/images/covers/beating-llamacpp-from-scratch-consumer-amd.png"
---

# Beating llama.cpp from Scratch on Consumer AMD: Building Strata, a Native Rust + HIP Local AI Engine

_How Software Architect Mihai Farcas engineered **[Strata](https://github.com/mihailtd/strata)** for Qwen 3.5 on an AMD Radeon RX 7900 XTX (gfx1100), eliminated a 3,300-kernel prefill launch storm, fixed an un-flushed 8KB socket stall, and achieved 83.0 tok/s sustained BF16 decode._

**By Mihai Farcas** — Software Architect & AI Systems Engineer

![Strata Architecture: Rust Host Orchestration, Qwen 3.5 Hybrid Topology, and AMD RDNA3 Execution | wide](/images/blog/runtime-next-architecture-poster.svg#wide)

Can you beat `llama.cpp` and `Ollama` by writing a custom local LLM inference engine from scratch in Rust and AMD HIP on consumer hardware?

The conventional wisdom across the local AI and open-source LLM communities says no. `llama.cpp` represents thousands of person-years of extreme C++ optimization: hand-tuned AVX-512 and AVX2 vector paths, custom GGML tensor kernels, optimized CUDA/HIP backends, and battle-tested memory allocators. On AMD silicon specifically, the common assumption is even more pessimistic: people call ROCm fragile, rank RDNA3 consumer cards (`gfx1100`) behind CDNA datacenter accelerators, and expect raw HIP kernels written from scratch to bring driver timeouts and kernel panics.

We decided to test that assumption directly on bare metal.

Over the past two months, as a Software Architect exploring the frontiers of bare-metal local AI and GPU kernel development, I engineered **[Strata](https://github.com/mihailtd/strata)** (internally codenamed `runtime-next`): a from-scratch local LLM serving runtime written in safe Rust with custom AMD HIP compute kernels, targeting the **Qwen 3.5 hybrid architecture** running on a single consumer desktop GPU: the **AMD Radeon RX 7900 XTX (24GB GDDR6, gfx1100)**.

We benchmarked head-to-head against both **`llama.cpp` (`llama-server`)** and **`Ollama` (`ollama serve`)** under strict, verifiable apples-to-apples conditions: independent HTTP daemons on localhost, streaming Server-Sent Events (SSE) over TCP sockets, unquantized byte-identical bfloat16 parameters, and 100% GPU offload on native ROCm 7.2.

Here are the headline results on the 4B model:

| Metric                         | [Strata](https://github.com/mihailtd/strata) (Rust + HIP) | `llama.cpp` (`llama-server`) | `Ollama` (`ollama serve`) | Architectural Win                               |
| :----------------------------- | :-------------------------------------------------------: | :--------------------------: | :-----------------------: | :---------------------------------------------- |
| **Decode Throughput**          |                      **83.0 tok/s**                       |          71.3 tok/s          |        72.0 tok/s         | **+16.4% vs llama.cpp** (+15.3% vs Ollama)      |
| **Time-To-First-Token (TTFT)** |                        **48.5 ms**                        |           121.0 ms           |         173.2 ms          | **-59.9% latency reduction** (-72.0% vs Ollama) |
| **Prefill Kernel Launches**    |                     **280 launches**                      |       ~3,300 launches        |      ~3,300 launches      | **-91.5% host CPU driver dispatch queue**       |
| **Streaming Frame Overhead**   |                       **&lt; 0.3%**                       |             n/a              |            n/a            | Isolated in-process A/B/C measurement           |
| **Weight Precision**           |                         **BF16**                          |             BF16             |           BF16            | Byte-identical parameters across all 3 arms     |

Across the wider model family, **Strata** maintained its decode and TTFT lead from **0.8B (285.9 vs 210.6 tok/s, +35.7%)** all the way to **9B (49.1 vs 44.6 tok/s, +10.2%)**, where execution hits the 960 GB/s physical memory bandwidth ceiling of the GDDR6 bus.

Getting there meant debugging a 3,300-kernel launch storm that locked the CPU driver queue for 50 ms, diagnosing a phantom 600 ms stall caused by an un-flushed 8KB HTTP socket buffer, debunking a widespread myth about per-token network streaming overhead, and restructuring decode attention into a 4-way parallel split-KV reduction kernel inspired by `llama.cpp` itself.

The sections below cover the engineering journey, the data, the kernel code, and the caveats.

---

## 🛠️ The Test Bench & The Parity Rules

Before any speedup claims, the benchmark needs ground rules. Comparing a raw CLI binary against an HTTP daemon, or quantized weights against float16, produces meaningless marketing numbers. I enforced strict architectural parity:

1. **Hardware Configuration**:
   - **GPU**: AMD Radeon RX 7900 XTX (Navi 31, RDNA3, target architecture `gfx1100`).
   - **Compute Units**: 96 Compute Units, 6,144 Stream Processors.
   - **VRAM**: 24 GB GDDR6 running on a 384-bit memory bus with **960 GB/s theoretical peak bandwidth**.
   - **Software Stack**: Linux x86_64, ROCm 7.2, HIP compiler (`hipcc`), GCC 14.
2. **Independent Network Daemons**:
   - Every engine ran as an independent background daemon listening on localhost: **Strata** on port `8003`, `llama-server` on port `8001`, and `ollama serve` on port `11434`.
   - Test clients issued HTTP `POST /v1/chat/completions` requests over TCP loopback sockets with `{"stream": true}`.
   - I measured **Time-To-First-Token (TTFT)** from the moment the socket opened until the first SSE chunk arrived at the client.
   - I calculated **decode throughput** as total generated tokens divided by the duration of the token generation phase.
3. **Weight Parity**:
   - Native unquantized **bfloat16 (BF16)** parameters across all three engines. No quantization artifacts or precision mismatches.
4. **100% ROCm GPU Acceleration Parity**:
   - Neither baseline could fall back to CPU compute.
   - I compiled `llama-server` natively with `GGML_HIP_GRAPHS=ON` and HIPBLAS support and ran it with `-ngl 999` to offload all 32 model layers plus embeddings and heads into VRAM.
   - `ollama serve` ran on CachyOS's hardware-accelerated `ollama-rocm` package, dynamically linking `/usr/lib/ollama/rocm_v7_2/libggml-hip.so` and pinning all 34 layers (8,023.7 MiB VRAM buffer).
5. **Exactness Gate**:
   - I checked greedy decode outputs token-for-token against reference completions from Hugging Face `transformers` and rejected any engine state that failed exact token-id parity. A broken kernel that skips operations runs faster because it computes the wrong thing.

---

## 🧠 The Beast: Qwen 3.5 Hybrid Architecture

Standard autoregressive Transformers (such as LLaMA 3 or Mistral) use standard Multi-Head or Grouped-Query Attention across every single layer. In those architectures, the Key-Value (KV) cache grows linearly ($O(T)$) with every generated token. By layer 32 at context length 8,192, a standard transformer allocates gigabytes of VRAM strictly to store KV activations.

Qwen 3.5 4B breaks this paradigm by utilizing a **hybrid topology** across its 32 layers:

- **24 Gated DeltaNet (GDN) Linear Attention Layers**:
  These layers replace standard quadratic attention with a **fixed-size recurrent state matrix** $S_t \in \mathbb{R}^{32 \times 128 \times 128}$ in single precision (FP32). Each layer maintains a 2.0 MB recurrent state, totaling **48.0 MB across all 24 layers**. As tokens arrive, $S_t$ updates causally in-place via a 1D convolution and a gated delta update rule. Memory consumption is **strictly $O(1)$**—it never expands by a single byte regardless of whether the prompt is 10 tokens or 10,000 tokens long.
- **8 Full Grouped-Query Attention (GQA) Layers**:
  Positioned at every 4th layer (specifically layers 3, 7, 11, 15, 19, 23, 27, and 31). These 8 layers maintain a standard dynamic KV cache (`[4 heads, seq_len, 256 dim]` in BF16), consuming **32 KB per token across all 8 layers**. These full attention layers preserve exact context retrieval and multi-needle recall over long sequences.

> [!NOTE]
> **The Detective's Notebook Analogy**:
> Imagine a detective investigating a complex case. For 75% of their daily work (the 24 GDN layers), the detective writes condensed, rolling summaries into a small, pocket-sized notebook of fixed size. The notebook never gets heavier, and older facts are continuously merged and compressed. For the remaining 25% of critical evidence (the 8 Full Attention layers), the detective keeps verbatim transcripts of witness testimonies, meticulously re-reads every transcript from page one whenever a new question arrives.

This hybrid structure dictates the inference engine's performance profile: memory allocation is lean, but the execution pipeline constantly alternates between linear recurrent scans and quadratic attention projections.

![Qwen 3.5 layer map: 24 Gated DeltaNet layers with fixed 48 MB state and 8 full-attention layers with a growing KV cache | wide](/images/blog/strata-hybrid-layers.svg#wide){width=1200 height=600}

---

## Act 0: From 31.7 to 82.2 tok/s (The Raw Decode Engine)

My first naive port of the Qwen 3.5 architecture in Rust and raw HIP ran at **31.7 tok/s**. It produced correct output but trailed `llama.cpp` (71.3 tok/s) by more than 55%.

Reaching 82+ tok/s took four optimization passes on the GPU kernels:

```
Pass 0: Baseline naive port                       31.7 tok/s
Pass 1: Buffer reuse & sync elimination          44.3 tok/s (+40%)
Pass 2: Projection GEMM fusing                    49.2 tok/s (+11%)
Pass 3: HIP Graphs + Vectorized GEMV + Argmax    81.2 tok/s (+65%)
Pass 4: GDN Thread Block Occupancy Tuning         82.2 tok/s (+1.2%)
```

![Decode throughput climbing from 31.7 to 82.2 tok/s across four optimization passes, against the llama.cpp baseline of 71.3 | wide](/images/blog/strata-decode-waterfall.svg#wide){width=1200 height=650}

### Why Safe Rust with HIP?

Writing bare-metal GPU kernels for AMD RDNA3 requires compiling HIP C++ through `hipcc`. The host-side architecture also matters for low-latency local AI serving. I wrote Strata's host engine in Rust, which gave three benefits:

1. **FFI Encapsulation**: I isolated unsafe raw device pointers and HIP runtime invocations in a minimal, audited FFI module ([`hip.rs`](https://github.com/mihailtd/strata/blob/main/apps/runtime-next/src/hip.rs)).
2. **Safe Graph Orchestration**: I wrote the entire model execution DAG, KV management, and network server in 100% safe Rust.
3. **Zero Interpreter Latency**: Leaving Python removed the Global Interpreter Lock (GIL), garbage collection pauses, and runtime dispatch overhead, and these hurt real-time local LLM applications.

### The Optimization Passes

- **Pass 1 (31.7 → 44.3 tok/s)**: We eliminated redundant host-to-device synchronizations (`hipDeviceSynchronize`) between consecutive layers and replaced transient VRAM allocations with pre-allocated static execution scratchpads.
- **Pass 2 (44.3 → 49.2 tok/s)**: We fused projection operations, reading directly from combined GEMM output buffers. We evaluated `hipBLASLt` as an alternative to `hipblasGemmEx`, but benchmarks showed it ran marginally slower on Qwen's specific rectangular matrix dimensions, so we retained `hipblasGemmEx`.
- **Pass 3 (49.2 → 81.2 tok/s)**: This was the architectural breakthrough, unlocked by three changes:
  1. **HIP Graph Replay**: Autoregressive decode evaluates exactly one token ($M=1$) per step. Re-issuing dozens of small kernels every 12 milliseconds flooded the host CPU with dispatch work. By capturing the complete decode iteration into a frozen `hipGraphExec_t`, host dispatch cost dropped to virtually zero.
  2. **Custom Vectorized GEMV (`ushort4`)**: Single-token decode is a matrix-vector product, not a general matrix-matrix multiply. Standard GEMM kernels use warp tiles poorly at $M=1$. We implemented a custom HIP GEMV kernel using vectorized 64-bit loads (`ushort4`, loading 4 BF16 elements per instruction), doubling global memory throughput on the dominant projection matrices.
  3. **On-Device Argmax Reduction**: In naive implementations, the host copies the final logit tensor (248,320 floating-point numbers) over PCIe to the CPU, which performs an argmax to select the next token. We replaced this with an on-device parallel reduction kernel ([`argmax.hip`](https://github.com/mihailtd/strata/blob/main/apps/runtime-next/src/kernels/argmax.hip)), reducing host-bound PCIe traffic from **993 KB per token to a single 4-byte integer**.
- **Pass 4 (81.2 → 82.2 tok/s)**: We profiled kernel execution using AMD's official profiler, `rocprofv3`. The trace revealed that `gdn_recurrent_decode` used only 32 of the RX 7900 XTX's 96 Compute Units (launching one workgroup per attention head across 32 heads). Increasing the thread block size from 128 to 1,024 threads improved wave occupancy on Navi 31, reducing kernel execution from **60.5 μs to 24.9 μs**.

With decode reaching 82.2 tok/s in internal harnesses, we turned to real-world prompt prefill and HTTP serving. That is where things broke.

---

## Act 1: The 3,300-Kernel Launch Storm

When we first ported prompt prefill, the forward pass processed incoming tokens sequentially inside a loop over sequence length $T$:

- **Causal Conv1D**: 54 tokens $\times$ 24 GDN layers = **1,296 kernel launches**
- **GDN Gate & Beta Computation**: 54 tokens $\times$ 24 GDN layers = **1,296 kernel launches**
- **RoPE Position Embeddings**: 54 tokens $\times$ 8 Attention layers = **432 kernel launches**
- **KV Cache Appends**: 54 tokens $\times$ 8 Attention layers = **432 kernel launches**

A standard **54-token prompt** triggered **~3,300 distinct HIP kernel launches**.

> [!NOTE]
> **The Chef and the Grains of Rice**:
> Imagine a state-of-the-art commercial kitchen staffed by 6,144 eager cooks (the GPU stream processors). Instead of bringing in a sack of rice to cook, an assistant walks through the kitchen door 3,300 times in a row, handing the cooks exactly one grain of rice per trip. The cooks spend 95% of their time staring at the swinging kitchen door waiting for the assistant to walk through.

At 15–20 μs of driver dispatch latency per launch on Linux ROCm, host CPU driver overhead consumed **over 50 milliseconds** before the GPU finished computing the prompt.

### The Fix: Batched Chunk Kernels

We eliminated the per-token dispatch loops by writing four batched prefill kernels that process the entire prompt sequence in a single launch per layer:

| Kernel Operation        | Unbatched Launches (T=54) | Batched Launches | Parallelization Mechanism                                                                                                |
| :---------------------- | :-----------------------: | :--------------: | :----------------------------------------------------------------------------------------------------------------------- |
| **Causal Conv1D**       |           1,296           |      **24**      | Bounded lookback ($k=4$): 1 thread per channel scans all $T$ tokens carrying a 4-element register window.                |
| **GDN Gate & Beta**     |           1,296           |      **24**      | 2D parallel grid over $(\text{token}, \text{head})$: Zero cross-token recurrence; heads indexed via `tid % num_v_heads`. |
| **RoPE Embeddings**     |            432            |      **8**       | Vectorized position indexing: Each token rotates via its precomputed absolute position buffer.                           |
| **KV Cache Append**     |            432            |      **8**       | Direct strided scatter: Each token writes directly into its designated memory offset in VRAM.                            |
| **Total Host Launches** |        **~3,300**         |     **280**      | **-91.5% reduction in CPU driver dispatch queue lag**                                                                    |

![Kernel launches per prefill: per-token loops versus batched kernels, 3,300 down to 280 | wide](/images/blog/strata-launch-storm.svg#wide){width=1200 height=700}

Batching these operations reduced internal GPU prefill latency from **78.95 ms to 71.28 ms**. We expected HTTP Time-To-First-Token to drop proportionally.

Instead, TTFT stalled.

---

## Act 2: The Phantom Stall: A 600ms Bug Behind a 70ms Kernel

When we pointed `curl` and Python clients at our HTTP endpoint, Time-To-First-Token sat at **613–640 milliseconds**.

Our GPU forward pass was taking 71 milliseconds. Where were the other 540 milliseconds going?

We systematically audited every component of the serving pipeline:

1. **Client Parsing Overhead**: We tested with raw `curl -N -w "%{time_starttransfer}\n" -s -o /dev/null`, confirming the same 600+ ms stall on bare sockets.
2. **State Reset**: We profiled `engine.reset_state()`, which cleared recurrent buffers in **0.05 ms**.
3. **BPE Tokenization**: We benchmarked the Hugging Face tokenizer decoding 350 tokens: **3.32 ms total** (~9 μs per token).

### The Smoking Gun: The Un-Flushed 8KB Buffer

We dug into our HTTP server dependency: `tiny_http` (version 0.12.0).

In `tiny_http`, the standard streaming API uses `Response::raw_print`, which internally wraps the HTTP response body in `chunked_transfer::Encoder`. Inspecting the source of `chunked_transfer` revealed a default that explained the stall:

```rust
// Inside chunked_transfer::Encoder
pub struct Encoder<W> {
    writer: W,
    buffer: [u8; 8192], // <-- HARDCODED 8KB INTERNAL BUFFER
    buffer_len: usize,
}
```

The encoder accumulated data into an **8,192-byte internal buffer** and did **not flush until the stream closed**.

At ~150 bytes per Server-Sent Event (SSE) JSON chunk (`data: {"choices":[{"delta":{"content":"foo"}}]}\n\n`), the server held **55 generated tokens in memory** before sending a single TCP packet.

> [!NOTE]
> **The Reluctant Mail Carrier**:
> A mail carrier establishes an arbitrary rule: _"I refuse to walk down the driveway until my mailbag weighs at least 8 kilograms."_ Even though you wrote and sealed your first letter in 70 milliseconds, the recipient has to wait while you write 54 more letters just to fill the carrier's bag.

The client was waiting for token 55, not the first token.

![Timeline of the 613 ms time-to-first-token stall caused by the 8 KB buffer, and the 48.5 ms result after the fix | wide](/images/blog/strata-ttft-stall.svg#wide){width=1200 height=710}

### The Resolution

We bypassed the buffered `Response` abstraction entirely with `tiny_http`'s escape hatch, `Request::into_writer()`, which gives raw access to the underlying TCP socket stream.

We implemented custom HTTP/1.1 chunked framing with an explicit, unconditional `.flush()` executed immediately after every SSE token:

```rust
// Direct socket writer bypassing chunked_transfer 8KB buffer
let mut writer = request.into_writer();
write!(writer, "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\nContent-Type: text/event-stream\r\n\r\n")?;
writer.flush()?;

for token_str in engine.stream_tokens() {
    let sse_payload = format!("data: {}\n\n", serde_json::to_string(&chunk)?);
    write!(writer, "{:X}\r\n{}\r\n", sse_payload.len(), sse_payload)?;
    writer.flush()?; // <-- FORCES IMMEDIATE TCP PACKET EMISSION
}
```

The effect showed immediately:

| Engine State   | TTFT (Cold Start) | TTFT (Warm Cache) | Delivery Mode                   |
| :------------- | :---------------: | :---------------: | :------------------------------ |
| **Before Fix** |     700.0 ms      |     410.0 ms      | Buffered (8KB Socket Stall)     |
| **After Fix**  |   **180.0 ms**    |    **48.5 ms**    | **Direct Unbuffered SSE Flush** |

Bypassing the socket buffer dropped warm TTFT from 410 ms to **48.5 ms**—an 8.4x improvement that exposed the GPU's real speed.

---

## Act 3: Debunking the Streaming Overhead Myth

With the socket stall resolved, 350-token streaming benchmarks reported **78.7–80.2 tok/s**.

Earlier microbenchmarks on short 5-token prompts had clocked 90+ tok/s, which raised a question: _Does flushing every single token over TCP add socket overhead that starves the GPU?_

We tested two common network adjustments:

1. **Flush Coalescing (`FLUSH_INTERVAL`)**: Buffering token writes into a 250 ms time window raised decode throughput to **85.4 tok/s**, but inflated TTFT back to **336.4 ms**.
2. **`TCP_NODELAY`**: Enabling `TCP_NODELAY` on the server socket produced no measurable change (79.0 tok/s).

### The In-Process A/B/C Isolation Test

Instead of accepting flush coalescing's trade-off, we built an in-process diagnostic that isolates the microsecond cost of each stage in the generation loop:

- **Arm A**: Raw `engine.step()` alone (pure GPU forward pass + device argmax).
- **Arm B**: Arm A + BPE tokenizer decode + JSON string formatting + SSE chunk serialization.
- **Arm C**: Arm B + writing to socket buffer + explicit `.flush()`.

We executed all three arms across identical prompt workloads:

```
Arm A (Pure GPU step):                     79.40 tok/s
Arm B (GPU + Tokenizer + JSON/SSE):         80.15 tok/s
Arm C (GPU + Tokenizer + SSE + TCP Flush):  79.51 tok/s
```

All three arms were identical to within **0.3%**.

> [!NOTE]
> **The Car and the Turn Signal**:
> Blaming per-token HTTP flushing for GPU decode slowdown was like blaming the flashing turn signal on your dashboard for your car losing engine horsepower. The two systems are mechanically decoupled.
>
> Writing a 150-byte JSON chunk and flushing a TCP socket takes under **12 microseconds** on a modern CPU core. A GPU decode step takes **12,000 microseconds**. The GPU was not waiting on the network.

The isolation test cleared per-token flushing. We discarded flush coalescing and kept immediate streaming.

Why, then, was throughput dropping from 80.5 tok/s down to 77.6 tok/s over long sequences?

---

## Act 4: The KV Cache Bottleneck & 4-Way Split-KV Attention

The clue lay in Arm A's segment logs. When we examined decode speed in 50-token windows across generation depth, a clear pattern emerged:

```
Tokens  54 → 104:  80.00 tok/s
Tokens 104 → 154:  80.57 tok/s
Tokens 154 → 204:  80.38 tok/s
Tokens 204 → 254:  79.53 tok/s
Tokens 254 → 304:  77.61 tok/s  <-- THROUGHPUT DECLINE
Tokens 304 → 354:  78.43 tok/s
```

Throughput decayed steadily as sequence length grew.

I had taken the earlier 90+ tok/s measurements on 5-token prompts at positions 5–28. Over realistic 350-token generation trajectories, attention cost grew with sequence depth.

### The Mechanism

In Qwen 3.5's 8 full-attention layers, each generated token must compute dot-product attention against all preceding tokens stored in the KV cache.

Our initial decode attention kernel ([`attention.hip`](https://github.com/mihailtd/strata/blob/main/apps/runtime-next/src/kernels/attention.hip)) assigned **one thread per output dimension** (`head_dim = 256`). In the final weighted-V-sum reduction phase, that single thread executed a **fully serial loop over all $K$ past positions in the cache** ($O(kv\_len)$ serial scan).

> [!NOTE]
> **The Lone Archivist**:
> Imagine a researcher tasked with reviewing case files. When the archive holds 20 files, one person finishes quickly. When the archive expands to 350 files, that same lone researcher must read through all 350 files sequentially from start to finish, while 1,000 colleagues sit idle at their desks.

### 4-Way Split-KV Parallel Reduction

Borrowing the core concept from `llama.cpp`'s `fattn-vec.cuh`, we redesigned decode attention into a cooperative parallel reduction kernel ([`attention_decode_split.hip`](https://github.com/mihailtd/strata/blob/main/apps/runtime-next/src/kernels/attention_decode_split.hip)):

- **4 Cooperative Workers (`kv_split = 4`)**: Instead of 1 thread per dimension, 4 parallel worker threads collaborate on each output dimension:
  ```c
  int d     = tid % head_dim;
  int split = tid / head_dim; // 0..3
  ```
- **Strided Segment Scanning**: Each worker thread scans exactly $\frac{1}{4}$ of the KV cache length concurrently:
  $$\text{partial}[\text{split}, d] = \sum_{j=\text{split}, \text{step } 4}^{kv\_len} \text{prob}[j] \cdot V[j, d]$$
- **Warp Tree Reduction in LDS**: A workgroup tree reduction combines partial sums in GPU shared memory (Local Data Share, LDS).
- **RDNA3 Hardware Bound**: `head_dim (256) × kv_split (4) = 1,024 threads per block`. This lands exactly on the **physical thread limit per compute block on AMD RDNA3 silicon**.

![Serial single-thread KV scan compared with four strided workers merged by a tree reduction in LDS | wide](/images/blog/strata-split-kv.svg#wide){width=1200 height=620}

```c
// Excerpt from apps/runtime-next/src/kernels/attention_decode_split.hip on GitHub
extern "C" __global__ void attention_decode_split_bf16_kernel(
    const unsigned short* q,
    const unsigned short* k,
    const unsigned short* v,
    unsigned short* out,
    int num_q_heads, int num_kv_heads,
    const int* __restrict__ position_ptr,
    int kv_stride, int head_dim, int kv_split, float scaling,
    long long cache_stride, long long q_stride
) {
    // 1024 threads per workgroup cooperating on reduction
    int tid = threadIdx.x;
    int d = tid % head_dim;
    int split = tid / head_dim;
    // ... parallel scan over kv_len / kv_split ...
    // ... LDS shared memory warp combine ...
}
```

The microbenchmark measurements validated the redesign:

| Cache Length ($T$) | Scalar Kernel Execution | 4-Way Split Kernel Execution | Kernel Speedup |
| :----------------: | :---------------------: | :--------------------------: | :------------: |
|   **64 tokens**    |        14.34 μs         |         **8.68 μs**          |   **1.65×**    |
|   **128 tokens**   |        19.55 μs         |         **10.37 μs**         |   **1.88×**    |
|   **256 tokens**   |        32.46 μs         |         **14.04 μs**         |   **2.31×**    |
|   **354 tokens**   |        44.81 μs         |         **16.79 μs**         |   **2.67×**    |

![Attention kernel time by cache length: scalar versus 4-way split, with speedups from 1.65x to 2.67x | wide](/images/blog/strata-kernel-speedup.svg#wide){width=1200 height=620}

When tested in the live HTTP server over full 350-token generation trajectories, decode throughput stayed flat:

```
Segment Tokens 54  → 104:  83.05 tok/s
Segment Tokens 104 → 154:  83.86 tok/s
Segment Tokens 154 → 204:  83.80 tok/s
Segment Tokens 204 → 254:  83.66 tok/s
Segment Tokens 254 → 304:  83.41 tok/s
Segment Tokens 304 → 354:  83.21 tok/s
```

With 4-way split-KV attention active, the generation cadence held steady at **~83.5 tok/s** from token 1 to token 350.

![Decode tok/s across 350 tokens: scalar attention decays to 77.6, split-KV attention stays near 83.5 | wide](/images/blog/strata-decode-vs-depth.svg#wide){width=1200 height=640}

---

## Act 5: Auditing the Baselines & The Speculative Decoding Trap

To guarantee that our lead over `llama.cpp` was legitimate, we conducted an exhaustive configuration audit of `llama-server`:

| Flag / Parameter        | Status in Baseline | Impact on Fairness                                                                                            |
| :---------------------- | :----------------- | :------------------------------------------------------------------------------------------------------------ |
| `-ngl 99`               | ACTIVE             | Parity: 100% of all 32 layers pinned to VRAM. Zero CPU fallback.                                              |
| `-fa on`                | ACTIVE             | Parity: Flash Attention enabled for full attention layers.                                                    |
| `-ctk / -ctv q8_0`      | ACTIVE             | **Advantage llama.cpp**: 8-bit quantized KV cache reduces bandwidth vs **Strata**'s unquantized BF16 buffers. |
| `GGML_HIP_GRAPHS`       | ACTIVE             | Parity: Verified compiled ON in `CMakeCache.txt`. HIP graph replay active on gfx1100.                         |
| `-b 512 / -ub 512`      | ACTIVE             | Parity: Matched batch and microbatch sizes.                                                                   |
| `-t 8`                  | ACTIVE             | Parity: 8 host CPU worker threads allocated.                                                                  |
| `--spec-type ngram-mod` | TESTED SEPARATELY  | Model-free speculative decoding evaluated below.                                                              |

I enabled every known acceleration flag for `llama.cpp`. In fact, running with `-ctk q8_0 -ctv q8_0` gave `llama.cpp` an inherent memory bandwidth advantage, as its attention layers read half as many KV bytes per token.

### Why Speculative Decoding Failed on Code Generation

Could `llama.cpp` close the gap by enabling speculative decoding? We evaluated model-free n-gram speculation (`--spec-type ngram-mod`):

| Configuration                             | Sustained tok/s |  TTFT (ms)   |          Delta Throughput           |
| :---------------------------------------- | :-------------: | :----------: | :---------------------------------: |
| **`llama.cpp` Baseline (No Speculation)** | **72.73 tok/s** | **108.0 ms** |              Baseline               |
| `llama.cpp` + `ngram-mod` (Run 1)         |   72.75 tok/s   |   107.4 ms   |         +0.02 tok/s (0.0%)          |
| `llama.cpp` + `ngram-mod` (Run 2)         |   71.04 tok/s   |   140.7 ms   | **-1.69 tok/s (-2.3% degradation)** |

Telemetry logs emitted by `llama-server` revealed the failure mechanism:

```json
"timings": {
    "prompt_n": 54,
    "predicted_n": 350,
    "draft_n": 64,
    "draft_n_accepted": 5
}
```

The server accepted **only 5** of 64 drafted tokens, a **7.8% acceptance rate**.

![64 drafted tokens with 5 accepted, and sustained decode tok/s with and without speculation | wide](/images/blog/strata-spec-decoding.svg#wide){width=1200 height=620}

> [!NOTE]
> **The Guessing Assistant**:
> An assistant attempts to guess the end of your sentence. If they shout out 64 words and 59 are wrong, you spend far more time stopping, correcting them, and restarting than if you had simply spoken at your normal pace.

In programming tasks (such as writing SQL migrations, FastAPI routes, and DuckDB analytics), tokens require exact syntactic and logical precision. Because every rejected token incurs verification passes and KV rollback overhead, an acceptance rate below 10% actually **reduces** throughput on an already-optimized decode loop.

---

## Act 6: Multi-Size Scaling (0.8B to 9B) & The Memory Bandwidth Wall

Does this speedup hold as models scale? We ran the identical head-to-head benchmark suite across the entire Qwen 3.5 dense family: **0.8B, 2B, 4B, and 9B**.

All three engines loaded byte-identical BF16 weights, and all outputs passed the exactness gate against Hugging Face references:

| Model Tier | **Strata** (Rust + HIP) | `llama.cpp` |  `Ollama`   | Speedup vs llama.cpp | Speedup vs Ollama  |  TTFT (**Strata** vs llama.cpp)  |
| :--------: | :---------------------: | :---------: | :---------: | :------------------: | :----------------: | :------------------------------: |
|  **0.8B**  |     **285.9 tok/s**     | 210.6 tok/s | 222.5 tok/s |  **1.36× (+35.7%)**  | **1.28× (+28.5%)** | **17.0 ms vs 37.4 ms (-54.5%)**  |
|   **2B**   |     **166.9 tok/s**     | 136.4 tok/s | 135.0 tok/s |  **1.22× (+22.4%)**  | **1.24× (+23.7%)** | **26.8 ms vs 54.2 ms (-50.6%)**  |
|   **4B**   |     **83.0 tok/s**      | 71.3 tok/s  | 72.0 tok/s  |  **1.16× (+16.4%)**  | **1.15× (+15.3%)** | **48.5 ms vs 121.0 ms (-59.9%)** |
|   **9B**   |     **49.1 tok/s**      | 44.6 tok/s  | 45.1 tok/s  |  **1.10× (+10.2%)**  | **1.09× (+8.9%)**  | **81.0 ms vs 176.9 ms (-54.2%)** |

Across every size tier, **Strata** achieved the highest decode throughput and the lowest Time-To-First-Token.

![Decode tok/s for Strata, llama.cpp and Ollama at 0.8B, 2B, 4B and 9B, with Strata speedup shrinking from 35.7% to 10.2% | wide](/images/blog/strata-multisize.svg#wide){width=1200 height=740}

The trend is clear: **the throughput speedup margin compresses as model size grows** (from +35.7% at 0.8B down to +10.2% at 9B).

### The Kernel Execution Profile

To understand why the margin compresses, we profiled decode kernel execution across model sizes using `rocprofv3`:

```
Model Tier    Weight GEMV Kernels    GDN Recurrent Update    Other Ops (Attn, Norms, RoPE)
0.8B                72.66%                 13.59%                       13.75%
4B                  88.85%                  5.40%                        5.75%
9B                  93.64%                  3.02%                        3.34%
```

Two architectural realities explain this compression:

1. **Quadratic Parameter Scaling**:
   Weight matrix sizes scale with $\text{hidden\_size} \times \text{intermediate\_size}$ ($1,024 \times 3,584$ at 0.8B $\to$ $4,096 \times 12,288$ at 9B). By contrast, GDN recurrence cost scales with $\text{heads} \times \text{head\_dim}^2$, which stays constant. At 9B, GEMV consumes **over 93.6% of total GPU execution time**.
2. **The 960 GB/s Physical Memory Bandwidth Wall**:
   During single-token decode ($M=1$), the GPU must stream every parameter in the model from VRAM into the compute units exactly once per generated token:
   $$\text{Theoretical Max tok/s} = \frac{\text{Memory Bandwidth (GB/s)}}{\text{Model Size in VRAM (GB)}}$$
   At 9B in BF16 (~18.2 GB parameter buffer), the absolute theoretical ceiling on a 960 GB/s bus is:
   $$\frac{960 \text{ GB/s}}{18.2 \text{ GB}} \approx 52.7 \text{ tok/s}$$
   **Strata** achieved **49.12 tok/s**—which represents **93.2% of the theoretical physical memory bandwidth of the GPU**.

![Kernel time share by model size and 9B decode at 93.2% of the memory bandwidth ceiling | wide](/images/blog/strata-bandwidth-wall.svg#wide){width=1200 height=720}

When an engine operates at 93% of physical hardware wire limits, there is almost no software headroom left to extract. At 9B, both **Strata** and `llama.cpp` are memory-bandwidth bound.

---

## ⚠️ What Broke: Hard Limits & Caveats

An honest report documents what broke and where the hard ceilings sit. These are mine:

### 1. The 14,080-Token Shared Memory (LDS) Ceiling

In our 4-way split attention kernel ([`attention_decode_split.hip`](https://github.com/mihailtd/strata/blob/main/apps/runtime-next/src/kernels/attention_decode_split.hip)), shared memory is dynamically allocated across the workgroup:

```c
size_t shmem_bytes = (head_dim + kv_stride + threads + head_dim * kv_split) * sizeof(float);
```

On AMD RDNA3 (Navi 31, `gfx1100`), each Compute Unit workgroup has **64 KB of Local Data Share (LDS)**.

With `threads = 1024` and `head_dim = 256`, the longest sequence stride that fits into 64 KB is:
$$\text{max\_seq\_len} \le \frac{65,536}{4} - 256 - (2 \times 256 \times 4) = 14,080 \text{ tokens}$$

We discovered this the hard way: when we raised the context window to 32,768, prefill processed 32,000 tokens smoothly, and then the first decode step failed with a fatal HIP error: `hipErrorInvalidValue`.

Context length in **Strata** is currently bounded at **12,288–14,080 tokens**. Crossing this threshold requires refactoring decode attention into a multi-block Flash-Decode architecture that combines partial sums across separate workgroups.

![LDS budget for the split-KV kernel: 14,080 tokens fit in 64 KB, 32,768 tokens need 137 KB | wide](/images/blog/strata-lds-ceiling.svg#wide){width=1200 height=590}

### 2. Guarding Against GPU Page Faults

In early prototypes, if an incoming HTTP request requested `max_tokens: 4096` against an existing 7,000-token prompt, decode stepped right past the pre-allocated KV buffer, triggering an **uncorrectable GPU page fault** that crashed the ROCm driver and required a host reboot.

We hardened the generation loop with an explicit safety boundary:

```rust
if engine.context_exhausted() {
    chunk.finish_reason = Some("length");
    break;
}
```

The server now cleanly halts generation with standard HTTP `finish_reason: "length"`, preserving GPU memory integrity.

### 3. BF16 vs Quantization

Every benchmark in this article used **unquantized BF16 weights**. Unquantized inference is a pure test of memory bandwidth, kernel fusion, and host dispatch. Weight quantization (such as W4A16 INT4 or Q4_K_M) introduces on-the-fly dequantization math, integer unpacking overhead, and cache pressure—which presents a distinct set of tradeoffs (covered in Part 2).

### 4. Single-Sequence vs High-Throughput Batched Serving

I built **Strata** specifically for **interactive, low-latency agentic streaming (batch size $B=1$)**. When scaling to heavy server batching ($B=32$ or $B=64$), execution shifts from memory-bandwidth bound to compute bound. While Strata supports batched decode, multi-tenant serving introduces different trade-offs in prefill scheduling and KV memory fragmentation.

---

## 🎯 Key Engineering Takeaways

Building **Strata** from scratch taught us four fundamental principles of GPU systems engineering and local AI architecture:

1. **Host-Side Overhead Can Dwarf GPU Compute**:
   Our initial prefill implementation spent 50 ms in CPU driver queues issuing 3,300 small kernels, overshadowing the 20 ms of actual matrix compute. Batching host dispatch is just as critical as optimizing GEMM math.
2. **Default Socket Buffering Silently Breaks Streaming**:
   An innocent 8KB buffer inside an HTTP crate introduced a 540 ms latency penalty by silently hoarding the first 55 tokens. Streaming runtimes must take direct control of the TCP socket with immediate per-frame flushes.
3. **Isolate First, Hypothesize Second**:
   When streaming throughput drifted from 90 to 79 tok/s, our intuition blamed per-token network flushing. An in-process A/B/C isolation test proved network framing accounted for less than 0.3% of runtime, directing our attention to the real culprit: the serial KV cache reduction loop.
4. **Consumer AMD Silicon Is Genuinely Capable**:
   When programmed directly in native HIP and safe Rust, consumer AMD GPUs (like the Radeon RX 7900 XTX) deliver top-tier throughput and latency. You do not need enterprise datacenter silicon or closed proprietary APIs to achieve bleeding-edge local LLM inference performance.

---

_In **Part 2**, we examine what happened when we took Strata into quantized territory: why our initial W4A16 INT4 kernel lost to llama.cpp by 22%, and how custom dequant-gemv kernels turned it into a clean win across all model sizes._

---

## 👨‍💻 About the Author

**Mihai Farcas** is a **Software Architect**, **AI Systems Engineer**, and **GPU Kernel Developer** specializing in high-performance distributed systems, bare-metal hardware acceleration (AMD ROCm/HIP, NVIDIA CUDA), and local LLM infrastructure.

- **GitHub**: [github.com/mihailtd](https://github.com/mihailtd) (Explore the [Strata Repository](https://github.com/mihailtd/strata))
- **Engineering Blog & Portfolio**: [mihai.ltd](https://mihai.ltd)
- **Domain Focus**: Local AI Architecture, High-Throughput Inference Engines, Custom GPU Kernels, and Zero-Allocation Systems Programming in Rust and C++.

<!--
EDITOR NOTES (Verified against local repo & lab hardware):
- Hardware: AMD Radeon RX 7900 XTX (24GB GDDR6, gfx1100, ROCm 7.2).
- Source Code: https://github.com/mihailtd/strata (apps/runtime-next).
- Reference Benchmarks: results/benchmarks/4b_engine_comparison_scorecard.json & multi_size_engine_comparison_scorecard.json.
- Notebook Source: notebooks/runtime_next_breakthrough.py.
-->
