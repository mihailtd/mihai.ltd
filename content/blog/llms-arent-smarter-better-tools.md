---
title: "LLMs Aren't Smarter. The Tools Got Better."
description: "Why large language models haven't fundamentally gained general intelligence, how post-training curation creates an illusion of reasoning, why high-fidelity tooling masks brute-force statistics, and what Ion Creangă's 'Drobul de Sare' teaches us about AI panic."
date: "2026-10-03"
type: "blog_post"
tags:
  ["ai-engineering", "software-architecture", "systems-thinking", "dev-tools"]
cover_image: "/images/covers/llms-arent-smarter-better-tools.png"
---

# LLMs Aren't Smarter. The Tools Got Better.

_The Hobbit House with Drywall, the Metallurgy Trap, and the Myth of Infinite Scaling._

Every few months, tech social media declares that foundation models have crossed another cognitive Rubicon. Benchmark scores jump, demo videos flood the timeline, and commentators extrapolate a straight vertical line directly into artificial general intelligence.

The models haven't fundamentally gotten smarter. The tools got better.

At its mathematical foundation, a frontier transformer today is what it was four years ago: a statistical number machine predicting the next token across a high-dimensional probability distribution. What changed is our tooling: the compilers, linters, sandboxes, MCP servers, and post-training guardrails we wrap around the model.

High-fidelity tools produce clean, impressive artifacts. But mistaking high-fidelity execution for conceptual intelligence is a category error that leads engineering teams into bad architectural bets.

---

## 1. The Curation Illusion: Why RLHF Feels Like Reasoning

To understand why models feel smarter, look at how post-training actually works.

You take a base element technology. It is trained on random internet text, gigabytes of code, blog posts, and documentation. When it emerges from pre-training, it has no intent. It hallucinates freely, repeats loops, and outputs syntax errors.

So what do the labs do? They send it out into the world. They observe what works, what fails, and what breaks.

And then, through reinforcement learning (RLHF, DPO) and curated instruction tuning, they force it into specific paths. They beat the desired behavior directly into its weights.

```
┌─────────────────────────────────────────────────────────────┐
│                    THE CURATION PIPELINE                    │
│                                                             │
│   [ BASE MODEL ] ──▶ [ OBSERVE FAILURES ] ──▶ [ BEAT INTO ] │
│   Raw internet       Syntax errors, loops,    WEIGHTS (DPO) │
│   tokens mirror      deprecated APIs                        │
│                                                             │
│   RESULT: Walks groomed probability paths.                  │
│           Feels like reasoning. Still a number machine.     │
└─────────────────────────────────────────────────────────────┘
```

When you interact with it, it feels like it's reasoning from first principles. It feels like it understands your problem.

In reality, it is **statistical curation**.

The model tends to make the right choice more often because engineers brute-forced the wrong paths out of its weights through optimization. When you ask a modern model to write a Python script, it avoids deprecated libraries not because it understands package lifecycles, but because the probability distribution for deprecated tokens was artificially suppressed during alignment.

Underneath the polished conversational veneer, it is still calculating dot products across billions of floating-point numbers. They feel smarter, but they aren't inherently smart in terms of intelligence.

---

## 2. The Bias Machine: The Casino & Slot Machine Trap

Because the model is a stochastic number machine, we have accidentally built the perfect machine to play directly to human cognitive biases.

Think about how people interact with AI every day:

- **When it gets something right:** You say, _"It must be intelligent! Otherwise, how could it possibly write this complex Rust macro or solve this distributed systems bug?"_
- **When it gets something completely wrong:** You say, _"Oh, that's just because of the tooling. Or because I didn't prompt it right. Or because the context window got messy."_

You excuse every failure, and you deify every hit.

![The Slot Machine Effect: Playing to Human Cognitive Biases](/images/blog/slot-machine-cognitive-bias-poster.svg)

This is exactly how slot machines and casinos operate. Casinos have spent over a century preying on human psychology using **variable intermittent reinforcement schedules** to keep players hooked at the terminal. You pull the lever: occasionally three cherries line up, and you feel like a genius. Most of the time it takes your money, but you rationalize the loss: _"I just pulled the arm at the wrong angle; the next spin will hit."_

This is why the way we frame AI right now is so dangerous. It is the exact same psychological vulnerability that makes humans susceptible to superstition, religion, or conspiracy theories: looking at statistical noise, finding an accidental correlation, and projecting profound deliberate intent onto it.

---

## 3. The Analogy: The Hobbit House with Power Tools

I have an analogy for what modern AI tooling actually does.

### Phase 1: The Raw Model (Pawing at the Dirt)

Take early versions of foundation models. You tell the model: _"Build me a house."_

It has no tools. No measuring tape, no hammer, no concrete mixer. It paws at the raw dirt with its bare hands. When it finishes, it stands back and presents a muddy mound that sort of resembles a hobbit house. And it says: _"Done. Here is your house."_

That was GPT-3 in 2020. You asked for a full-stack web app, and it gave you a 40-line spaghetti script that crashed on line 12.

### Phase 2: The Agentic Revolution (Giving It Heavy Machinery)

Now, take that exact same entity and equip it with modern construction machinery:

- Laser levels (Language Server Protocol)
- Automated drywall cutters (linters like `ruff` and `biome`)
- Pre-fabricated concrete mixers (sandboxed compilers and test runners)
- Model Context Protocol (MCP) servers allowing it to inspect live schemas

Now, when you tell it to build a house, what does the output look like?

It has crisp 90-degree drywall corners. Polished Italian marble flooring. Triple-pane glass windows. High-fidelity finishes everywhere.

On the surface, it looks like a million-dollar architectural masterpiece.

Until you walk through the front door and look around:

- **The toilet is sitting in the middle of the kitchen.**
- **A load-bearing concrete pillar is placed directly in front of the bedroom doorway.**
- **The staircase leads straight into a solid ceiling.**

```
┌─────────────────────────────────────────────────────────────┐
│                   THE ARCHITECTURAL ILLUSION                │
│                                                             │
│   [ HIGH-FIDELITY TOOLS ]        [ STATISTICAL PREDICTOR ]  │
│   • Compilers & Linters          • No conceptual empathy    │
│   • Headless Sandboxes           • No mental model of state │
│   • Automated Test Runners       • Brute-force trial/error  │
│                                                             │
│   RESULT: Flawless syntax corners, but the toilet is in     │
│           the middle of the kitchen.                        │
└─────────────────────────────────────────────────────────────┘
```

The model did not design an architected structure. It assembled what an abstract statistical dataset of houses looks like in high-dimensional vector space.

When it needed to make a door opening in a brick wall, it didn't measure the studs or check structural integrity; it banged its head against the brick forty times until a hole appeared. In software, that looks like an autonomous coding agent running `pytest` forty times in a tight loop, mutating random lines of code until the exit code miraculously turns green.

That is not intelligence. That is **high-fidelity brute force**.

---

## 4. The Random Button Presser & The Monkey with a Machine Gun

This brings us to the question of risk: _Are the dangers of AI real?_

Yes, they absolutely are.

But are they real in the sense that models are sentient, conscious minds plotting world domination?

No. It is like the GIF of handing a monkey a machine gun, or a chaotic game of whack-a-mole.

If you give a stochastic entity a way to interact with APIs to affect the physical world, and there is an API endpoint out there that says `detonate_nuclear_bomb()`, sooner or later, just by brute forcing, it will detonate it.

Is that a conspiracy? Is that intelligence? Is that agency?

Nope. It is just maths and numbers. If you give a stochastic system more tools, more energy, and more compute, it will eventually execute anything within its accessible state space. And the path it takes is purely statistical probabilities.

![The Random Button Presser: State Machine vs Observer Illusion](/images/blog/random-button-state-machine-poster.svg)

Autonomous models launched recently—from Devin to autonomous terminal loops—are the clearest example of this. You interact with them for more than five minutes, and you immediately realize: they are neither intelligent nor sentient. Can they potentially do things? Yes!

And is it easy for humans to say _"the AI did it"_ and shift responsibility? Absolutely.

### The 10-Simulation State Machine Thought Experiment

Let's say I hard-code a random button presser.

I give it a finite set of buttons to press. When it presses a button, some other paths open or close—a classic finite state machine:

1. It presses Button 3: It probes an open network port.
2. Port 80 opens: It now unlocks options for Buttons 1 through 5.
3. It presses Button 2: It mutates a session token.
4. It presses Button 5: It escalates permissions.
5. At the end of the state tree, one of the terminal nodes is: _Call Destructive Unsafe API_.

I run this system 10 times in 10 different simulations.

Now imagine an observer who does not know that under the hood, this is just a random button presser traversing a state machine.

They look at the execution log of simulation #7, and what do they say?

> _"Oh my god, look at the intelligence! It chose to probe the port, mutate the token, and escalate privileges in that exact sequence! Only a conscious mind would know to execute those steps in that specific order! This AI has terrifying autonomous agency!"_

They construct an entire anthropomorphic narrative out of a random seed traversing Markov transition probabilities. The danger wasn't that the machine had a mind. The danger was that an engineer wired a random button presser to an unauthenticated destructive endpoint.

---

## 5. Drobul de Sare: Folklore Panic & The Three Greater Fools

There is a famous story in Romanian folklore by Ion Creangă called _**Prostia omenească**_ (_Human Stupidity_), published in 1877, though everyone in Romania knows it simply as _**Drobul de sare**_ (_The Salt Block_).

A young peasant husband walks into his house, and he finds his wife and his mother-in-law sitting by the stove, wailing and crying hysterically. They are completely paralyzed with grief, tearing their hair out.

In the middle of the room, their baby is sleeping peacefully in a wooden cradle.

The husband asks: _"Good people, why on earth are you crying like this? Did someone die? What tragedy has occurred?"_

The mother-in-law points up to the high ledge of the chimney oven. On that ledge sits a massive, heavy block of solid rock salt.

She cries: _"Do you see that salt block up on the oven? What if a cat jumps up there, knocks the salt block down, and it falls straight into the cradle and crushes my baby?! Oh, woe is us!"_

The husband looks at them in stunned disbelief. The cat isn't even in the house.

He walks over to the stove, reaches up, picks up the heavy block of salt with his bare hands, places it safely on the floor, and says: _"Why didn't you just move the salt?"_

And then he looks at the two of them and says:

> _"Bre, many fools have I seen in this world, but nobody as stupid as you two. I am packing a bag and leaving home right now. I will wander the earth, and I will only come back if I find people even more stupid than you two. If I can't find anyone more stupid, I am never coming back."_

And the hilarious punchline of the story—the thing that makes Creangă an immortal satirist—is that he goes out into the world, **and he actually finds people far more stupid.**

### The Three Greater Fools

1. **The Sunlight Shoveler:** He comes across a man running frantically back and forth in the blazing noon heat with a wooden wheelbarrow, trying to shovel sunlight into a dark, windowless shack. The husband takes an axe, cuts a window in the wooden wall, and light floods the room.
2. **The Cow on the Ladder:** He finds a farmer who tied a rope around a cow's neck, climbed a ladder onto the thatched roof of his barn where some green grass was growing, and is pulling with all his might trying to hoist a 500-kilogram cow up the ladder to graze. The poor beast is choking to death. The husband takes a sickle, cuts the thatch grass in thirty seconds, and drops it down to the cow.
3. **The Walnuts on a Pitchfork:** He finds a man holding a wooden pitchfork, throwing walnuts towards the high opening of his attic, screaming in fury because the walnuts keep falling straight through the tines of the fork back onto his face. The husband hands him a sack.

The husband bursts out laughing and realizes: _"My god, my wife and mother-in-law aren't even the biggest fools in the world after all!"_ And he goes back home.

![Drobul cu Sare: Folklore Panic vs Pragmatic Architecture](/images/blog/drobul-cu-sare-ai-panic-poster.svg)

### The Modern Tech Parallels

This 150-year-old folk tale is an exact diagnostic manual for modern AI engineering:

- **The Salt Block (Existential Hand-Wringing):** Policy panels, AI safety institutes, and Twitter philosophers sit around the stove wailing about rogue superintelligence: _"What if the cat knocks the salt block into the cradle?!"_ Meanwhile, the actual vulnerability is that an unauthenticated, destructive API was left sitting on the oven ledge, and a stochastic random button presser was given execution access to it. **Move the salt off the oven.** Put deterministic mutual TLS, RBAC, and sandboxes in place.
- **Fool #1 (Shoveling Sunlight):** Teams trying to shovel raw, unformatted LLM tokens directly into enterprise architectures with a wheelbarrow, with no schema, no contracts, and no structured validation, wondering why their system remains pitch black.
- **Fool #2 (Hoisting the Cow up a Ladder):** Engineers wiring a 70-billion-parameter foundation model with 40 autonomous tools, burning $5 of GPU compute to solve what a 3-line bash pipeline or indexed SQL query accomplishes in 2 milliseconds.
- **Fool #3 (Walnuts with a Pitchfork):** Teams trying to enforce deterministic business logic, security policies, and schema compliance through fuzzy prompt engineering—throwing walnuts with a pitchfork, and acting shocked when stochastic tokens slip right through the tines.

Stop crying about the cat. Move the salt off the oven. And put down the pitchfork.

---

## 6. The Metallurgy Trap: Why We Confuse Distant Boundaries with Infinity

Whenever a new tooling layer makes AI outputs look cleaner, tech commentators claim we are on a path of infinite vertical scaling:

$$\text{Capability} \to \infty$$

Every hype cycle relies on the same drawing: a straight vertical line pointing directly up. "Infinite scaling laws! Recursive self-improvement! AGI next quarter!"

Real engineering has never worked on vertical lines. Every physical technology in human history follows an **S-curve**:

```
Capability / Impact
     ▲
     │                                    [ Hard Physical Limit ]
     │                                     ──────────────────────
     │                                          ▲
     │                              Plateau 2  ┌┘ (Alloys / Modern Engines)
     │                             ───────────┐│
     │                                        ││
     │                           Plateau 1   ┌┘│
     │                         ─────────────┐│
     │                                      ││
     │     Explosive Growth ┌───────────────┘│
     │    ──────────────────┘
     └───────────────────────────────────────────────────────────────▶ Time / Effort
```

### The Metallurgy Paradigm

Consider the history of metallurgy:

1. **The Discovery of Raw Metal:** When humanity first learned to extract raw copper and tin, people must have felt like gods. _"We can forge tools and weapons that don't shatter like stone! This metal material will let us build infinitely!"_
2. **The First Plateau:** Pure copper and tin are soft. Weapons bend; tools dull quickly. You hit a hard physical ceiling on what raw elements can achieve.
3. **The Alloy Breakthrough:** Humanity discovered smelting and alloying—combining copper and tin into bronze, and later refining iron into steel. That breakthrough stepped humanity up to the next curve.
4. **The Ultimate Hard Boundary:** Even if you mined every single metric ton of iron in the entire Earth's crust, you still cannot build infinitely. Material physics has hard thermodynamic limits.

Eventually, resource and energy constraints force you to make **architectural decisions**: you cannot build everything at once, so you must decide what is actually worth spending the metal on, and what is not worth it.

There is no infinite scaling. There is zero historical evidence of it in any discipline.

We only call technologies "infinite" when the physical boundary sits further away than our immediate instruments can measure:

- We call the universe infinite because our telescopes cannot reach the edge.
- We feel like the sun is infinite because five billion years exceeds human temporal perception.
- We call LLM scaling infinite for the exact same reason: because the current compute horizon is expensive and far away. But the physical wall exists.

---

## 7. The Architect's Framework: Where Real Leverage Lives

If models are high-fidelity number machines bound by S-curves, what does this mean for software architects?

### 1. Stop Waiting for a "God Model" to Solve Architecture

A foundation model with 10 trillion parameters will still lack real-world organizational context, taste, and empathy. It will just generate high-fidelity mistakes faster.

### 2. Put the Intelligence in the Tooling, Not the Prompt

The reason modern coding agents succeed is not because the prompt whispered _"think step by step."_ They succeed because they are wired into deterministic feedback loops:

- Strict static typing (TypeScript, Rust, Go).
- Sandboxed compilers that reject invalid ASTs immediately.
- Process-compliance guardrails that verify execution evidence before allowing state mutations.

### 3. Verify Mental Models, Not Drywall Corners

When an agent gives you four paragraphs of eloquent code justification and clean syntax, do not assume it understood the problem.

Power tools make the drywall look smooth. But verifying that the toilet isn't in the kitchen—and making sure nobody left the salt block on the oven ledge—remains the engineer's responsibility.

Stop playing the slot machine. Move the salt off the oven. Build better tooling.
