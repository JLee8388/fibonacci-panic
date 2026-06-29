# Contributing

A short guide to working in this codebase. The goal is that gameplay rules stay
pure and testable, and everything else (DOM, audio, haptics, native) stays a
thin, swappable layer around them.

## Prerequisites

- Node 18+ (CI uses 20)
- For iOS builds: a Mac with Xcode 15+ (see [`docs/IOS_BUILD.md`](./docs/IOS_BUILD.md))

## Setup

```bash
npm install
npm run build      # compile Tailwind + bundle src/ into www/assets
npm run dev        # build, then serve www/ at http://localhost:8080
```

## The layers

```
src/
  rng.js         Injectable RNG (seedable for tests). Never call Math.random() elsewhere.
  constants.js   Players, Fibonacci tables, timing. No browser APIs.
  engine.js      PURE rules. Takes state (+rng), returns new state + events. No DOM/audio/timers.
  audio.js       Web Audio SFX, driven by engine events.
  haptics.js     Native (Capacitor) haptics with a navigator.vibrate fallback.
  view.js        All DOM rendering. Reads state, writes the page. No rules.
  main.js        Host: live state, the 50ms loop, input, native shell. Wires events -> effects.
```

### Golden rules

1. **Game logic goes in `engine.js` and must be pure.** No `document`, no
   `setTimeout`, no `Math.random()` (take an `rng` argument instead). This is
   what keeps the rules deterministic and unit-testable.
2. **Randomness flows through `rng.js`.** Production passes `defaultRng`; tests
   pass `mulberry32(seed)` for reproducibility.
3. **The engine talks to the world through `events`.** Return strings like
   `'pass'`, `'penalty'`, `'explode'`; `main.js` decides what sound/haptic/flash
   they trigger. Add a new event rather than reaching into the DOM from the engine.
4. **`view.js` only reads state.** If you need a new visual, add a render
   function that takes state and assert it in `tests/view.test.js`.

## Adding a feature (example: a new gameplay rule)

1. Extend `GameState` and the relevant function(s) in `engine.js`.
2. Add unit tests in `tests/engine.test.js` (cover the new branches + a
   determinism check).
3. If it produces a new effect, emit an `event` and handle it in
   `applyEffects()` in `main.js`.
4. If it changes the screen, add/extend a `view.js` renderer and a jsdom test
   in `tests/view.test.js`.
5. `npm run verify` (lint + test + build) must pass.

## Quality gates

```bash
npm run lint          # ESLint
npm run format        # Prettier (write)
npm run format:check  # Prettier (CI check)
npm test              # Vitest: pure engine + jsdom integration
npm run verify        # lint + test + build, all at once
```

CI (`.github/workflows/ci.yml`) runs the same gates on every push and PR. Keep
it green.

## Commit / PR conventions

- Small, focused commits with imperative messages ("Add 3-player mode").
- A PR should leave `npm run verify` green and update `ROADMAP.md` if it lands a
  roadmap item.
