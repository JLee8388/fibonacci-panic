# Short Fuze — Roadmap

This file tracks where the game is and where it's headed. The codebase is
deliberately structured so new features slot in without touching the core
rules. Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for how the layers fit
together.

## Architecture recap (why features are easy to add)

| Layer | File(s) | Rule of thumb |
| --- | --- | --- |
| Pure rules | `src/engine.js`, `src/rng.js`, `src/constants.js` | No DOM, no timers, no audio. Fully unit-tested. |
| Presentation | `src/view.js` | Renders from a state object. No game rules. |
| Effects | `src/audio.js`, `src/haptics.js` | Triggered by engine `events`, nothing else. |
| Host | `src/main.js` | Owns the live state, timer loop, input, native shell. |

A new gameplay rule is almost always: extend the engine + add tests, then
react to any new `event` in `main.js`. The UI and effects follow the state.

## Shipped (v1.0 — App Store launch)

- 4-player local pass-and-play on one device.
- Random active player, random Fibonacci timer (8/13/21/34s), random warning window.
- Over-tap penalty (bomb jumps back, −2s).
- Web Audio SFX, native haptics (Capacitor), screen-flash feedback.
- Fully offline (no CDN/remote code), safe-area aware, dark theme.
- Pure deterministic engine with unit + jsdom integration tests, CI, Capacitor iOS shell.

## Near-term candidates

- [ ] **Persistent scoreboard** — track losses per color across rounds.
      _Touchpoints: extend state in `engine.js`, persist via `@capacitor/preferences`, render in `view.js`._
- [ ] **2–3 player modes** — make `PLAYERS` count configurable from a menu.
      _Touchpoints: `constants.js` (player set), menu UI, engine already indexes generically._
- [ ] **Difficulty / speed settings** — alternate timer tables.
      _Touchpoints: `constants.js` Fibonacci tables, a settings screen._
- [ ] **Haptic intensity / accessibility toggles** — reduce-motion, colorblind labels.
      _Touchpoints: `view.js`, `haptics.js`, a settings store._

## Later / exploratory

- [ ] Online/Game Center leaderboards (requires a privacy + data-collection review).
- [ ] iPad-optimized layout and Apple TV remote support.
- [ ] Localization (the rules screen is the only copy-heavy surface).
- [ ] Android build (Capacitor already supports it; add `@capacitor/android`).

## Release process (how a feature reaches the store)

1. Branch, implement, add/extend tests (`npm test`), `npm run verify`.
2. Open a PR — CI runs lint + format + tests + build automatically.
3. Merge to `main`.
4. Bump `version` in `package.json` and the iOS build number.
5. `npm run cap:sync && npm run cap:open`, archive in Xcode, upload.
6. See [`docs/IOS_BUILD.md`](./docs/IOS_BUILD.md) and
   [`store/APP_STORE_SUBMISSION.md`](./store/APP_STORE_SUBMISSION.md).
