---
title: "Why I Built pytest-async-benchmark: Real Async Benchmarking for Python"
description: "Why pytest-benchmark fails on async coroutines, how pytest-async-benchmark measures execution inside the running event loop without overhead, and how pedantic mode isolates setup and teardown."
date: "2026-11-10"
type: "blog_post"
tags: ["python", "pytest", "asyncio", "benchmarking", "performance"]
cover_image: "/images/covers/why-i-built-pytest-async-benchmark.png"
canonical_url: "https://mihai.ltd/blog/why-i-built-pytest-async-benchmark/"
---

# Why I Built pytest-async-benchmark: Real Async Benchmarking for Python

_Benchmarking async Python inside pytest has long forced developers to choose between event loop restarts that skew measurements and manual loops that lose statistical depth._

When building high-throughput Python backends (like async database drivers, Quart or FastAPI services, and streaming pipelines), performance regression testing is essential. For synchronous code, `pytest-benchmark` provides fixtures, timing stats, and regression alerts.

For asynchronous coroutines, that workflow breaks down.

I built [pytest-async-benchmark](https://pypi.org/project/pytest-async-benchmark/) (source code on [GitHub](https://github.com/mihailtd/pytest-async-benchmark)) to benchmark async coroutines directly inside the running event loop. This article covers why existing workarounds fail, how native coroutine benchmarking works, and how pedantic mode separates database setup from timing results.

---

## The Async Benchmarking Problem

Standard benchmarking plugins in pytest evaluate synchronous callables. They execute a function repeatedly in a tight loop:

```python
def test_sync_operation(benchmark):
    result = benchmark(compute_hash, data)
    assert result is not None
```

Passing an `async def` coroutine to a synchronous benchmark runner fails. The runner only times creating the coroutine object (a few nanoseconds), without awaiting its execution.

Developers rely on three common workarounds, each with real drawbacks.

### 1. Recreating the Event Loop on Every Iteration

The most common workaround wraps the coroutine in `asyncio.run()`:

```python
def test_async_with_sync_runner(benchmark):
    benchmark(lambda: asyncio.run(fetch_user_record(user_id=42)))
```

This pattern creates and destroys an asyncio event loop on every measurement iteration. On CPython runtimes, initializing a new loop, configuring signal handlers, and closing it takes 0.4ms to 1.2ms.

If your coroutine takes 200μs, loop initialization easily exceeds the actual execution time. The benchmark measures runtime setup rather than your application code.

### 2. Event Loop Collisions Under pytest-asyncio

If your test suite uses `pytest-asyncio` to manage fixtures and test lifecycles, calling `asyncio.run()` inside a test raises an exception:

```text
RuntimeError: This event loop is already running
```

Because `asyncio.run()` cannot be called from a thread that already runs an active event loop, standard synchronous runners cannot be invoked inside asynchronous test functions.

### 3. Hand-Rolled Loops That Discard Statistical Distribution

To avoid loop creation overhead, teams often write manual loops:

```python
@pytest.mark.asyncio
async def test_manual_loop():
    start = time.perf_counter()
    for _ in range(100):
        await fetch_user_record(user_id=42)
    duration = (time.perf_counter() - start) / 100
    assert duration < 0.005
```

A manual loop solves the loop recreation issue, but discards the core benefits of a benchmark framework:

- It produces only an aggregate arithmetic mean, hiding latency spikes.
- It loses minimum, maximum, median, and standard deviation metrics.
- It lacks warmup rounds, meaning JIT compilation, connection establishment, or cache warming pollute the average.
- It requires custom assertion and reporting code in every test file.

---

## How pytest-async-benchmark Works

I designed `pytest-async-benchmark` around a straightforward requirement: benchmark coroutines natively within the running event loop, while collecting full statistical distributions and presenting them in readable terminal tables.

You install the package directly from PyPI:

```bash
pip install pytest-async-benchmark
# or with uv
uv add --dev pytest-async-benchmark
```

The core entry point is the `async_benchmark` fixture. It runs the target coroutine through configurable warmup rounds, executes designated benchmark rounds and iterations, records individual iteration times with `time.perf_counter()`, and computes statistical metrics.

### Dual Interface Architecture

A common friction point in Python testing is configuration mismatch: some projects configure `pytest-asyncio`, while others run pytest without an async runner plugin.

`pytest-async-benchmark` detects its environment at runtime and supports both patterns through a dual interface:

#### 1. Native Await Syntax (with pytest-asyncio)

When `pytest-asyncio` is installed and active, the fixture returns an awaitable coroutine:

```python
import pytest


@pytest.mark.asyncio
async def test_token_generation_speed(async_benchmark):
    result = await async_benchmark(generate_session_token, user_id=101, rounds=10)

    assert result["mean"] < 0.002
    assert result["stddev"] < 0.0005
```

#### 2. Synchronous Interface (without pytest-asyncio)

When running in an environment without `pytest-asyncio`, the fixture wraps the execution in a custom result container (`_SyncResultWrapper`) that evaluates the benchmark without requiring the test function itself to be declared async:

```python
def test_token_generation_sync_style(async_benchmark):
    result = async_benchmark(generate_session_token, user_id=101, rounds=10)

    assert result["mean"] < 0.002
```

Both styles produce the same dictionary structure containing `min`, `max`, `mean`, `median`, `stddev`, `rounds`, `iterations`, and `raw_times`.

---

## Isolating Setup and Teardown with Pedantic Mode

In production systems, benchmarks rarely run in isolation without state. When testing an indexing pipeline, a cache eviction algorithm, or a database query, each iteration often requires fresh prerequisites:

- Inserting a test dataset.
- Opening an authenticated network session.
- Generating transient keys or database records.
- Closing connections and removing temporary files afterward.

If setup runs inside the target function, its duration corrupts the timing numbers.

In version 0.3.0 of `pytest-async-benchmark`, I implemented `async_benchmark.pedantic()` to handle this pattern cleanly. It follows the pedantic model established by `pytest-benchmark`, adapted for asynchronous execution.

### How Pedantic Execution Operates

```python
@pytest.mark.asyncio
async def test_database_indexing(async_benchmark):
    async def setup():
        db = await create_ephemeral_database()
        return db

    async def teardown(db):
        await db.close()

    async def index_records(db):
        await db.execute("CREATE INDEX idx_users ON users(tenant_id, email)")

    result = await async_benchmark.pedantic(
        index_records,
        setup=setup,
        teardown=teardown,
        rounds=5,
        iterations=1,
    )

    assert result["mean"] < 0.015
```

During each iteration:

1. `setup()` executes (supporting both synchronous functions and async coroutines).
2. The value returned by `setup` passes as arguments to the target function and to `teardown`. If `setup` returns a tuple, values unpack into positional arguments.
3. High-resolution timestamps record only target coroutine execution:

   ```python
   start_time = time.perf_counter()
   try:
       await func(*call_args, **kwargs)
   finally:
       end_time = time.perf_counter()
       round_times.append(end_time - start_time)
       if teardown is not None:
           await self._call_hook(teardown, *teardown_args)
   ```

4. `teardown()` executes inside a `finally` block, cleaning up resources if an assertion or target call fails.

Setup duration (such as 40 milliseconds to initialize an in-memory SQLite schema) and teardown duration are strictly excluded from the benchmark statistics. The recorded metrics reflect solely the execution duration of `index_records`.

---

## Comparing Implementations Side-by-Side

Performance engineering often requires evaluating two candidate algorithms or verifying whether an optimization delivered measurable speedup.

`pytest-async-benchmark` includes a comparison suite (`BenchmarkComparator`, `a_vs_b_comparison`, and `quick_compare`) that runs multiple scenarios and outputs speedup ratios directly to the terminal:

```python
import asyncio
from pytest_async_benchmark import a_vs_b_comparison


async def query_unbuffered():
    await asyncio.sleep(0.008)  # Unbuffered baseline


async def query_with_connection_pool():
    await asyncio.sleep(0.003)  # Optimized pool


def test_pool_optimization():
    comparison = a_vs_b_comparison(
        "Direct Query",
        query_unbuffered,
        "Connection Pool",
        query_with_connection_pool,
        rounds=10,
        iterations=5,
    )

    # Automatically computes speedup factor and percentage difference
    assert comparison["winner"] == "Connection Pool"
```

The plugin formats outputs using Rich, printing comparative tables with color-coded speedup factors, percentile distributions, and performance grades.

---

## Verifying Package Status and Next Steps

As the creator and maintainer of `pytest-async-benchmark`, I maintain the package on [PyPI](https://pypi.org/project/pytest-async-benchmark/#description) and the [GitHub repository](https://github.com/mihailtd/pytest-async-benchmark).

Version 0.3.0 is published and verified across Python 3.9 through Python 3.13. It includes:

- Native coroutine benchmarking without event loop restarts.
- Pedantic mode with sync and async `setup`/`teardown` hooks.
- Dual interface support for environments with or without `pytest-asyncio`.
- Full compatibility with modern Python 3.13 and pytest 9.x runtimes.

If your team runs asynchronous Python services and needs accurate latency metrics in your test suites, install `pytest-async-benchmark` and replace hand-rolled timing loops with native, statistically sound measurements.
