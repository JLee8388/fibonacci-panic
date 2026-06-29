# Short Fuse

A fast, loud, 4-player **pass-the-bomb party game** for one device. When the
bomb lands on you, tap your corner to pass it on — just don't be holding it when
the random fuse burns out. **BOOM.**

> Originally prototyped as a single HTML file ("Fibonacci Panic"), now a modular,
> unit-tested codebase wrapped as a native iOS app with Capacitor and ready for
> the App Store.

## Gameplay

- **4 players, one phone** — each takes a corner panel.
- **Random turn order** — the bomb jumps to a random player on every pass.
- **Mystery fuse** — each round secretly runs 8, 13, 21, or 34 seconds.
- **Random panic warning** — the red "about to blow" window starts at a random time.
- **Over-tap penalty** — mash out of turn and the bomb snaps back to you, −2s.

## Tech stack

| Concern | Choice |
| --- | --- |
| Game rules | Pure, deterministic, seedable JS engine (`src/engine.js`) |
| UI | Vanilla DOM + compiled Tailwind CSS (offline, no CDN) |
| Icons | Lucide (vendored locally) |
| Audio / haptics | Web Audio + native Capacitor Haptics |
| Native shell | Capacitor (iOS) |
| Build | esbuild + Tailwind CLI |
| Tests | Vitest (pure unit + jsdom integration) |
| Quality | ESLint + Prettier + GitHub Actions CI |

## Quick start

```bash
npm install
npm run build      # compile CSS, vendor icons, bundle src/ -> www/assets
npm run dev        # serve the game at http://localhost:8080
npm test           # 21 unit + integration tests
npm run verify     # lint + test + build (the full gate)
```

## Project layout

```
src/            Modular source (engine, rng, view, audio, haptics, main, constants)
tests/          Vitest suites (engine unit tests + jsdom view integration)
scripts/        build.js (esbuild + vendor), gen-art.py (icon/splash art)
www/            What ships in the app (index.html + built assets)
resources/      App icon + splash source art (1024 / 2732)
store/          App Store listing copy, privacy policy, review notes, submission checklist
docs/           iOS build guide
.github/        CI workflow
```

## Publishing to the App Store

This repo is set up to ship. Start here:

1. **[`store/APP_STORE_SUBMISSION.md`](./store/APP_STORE_SUBMISSION.md)** —
   the full checklist, stage gates, and review-risk hurdles.
2. **[`docs/IOS_BUILD.md`](./docs/IOS_BUILD.md)** — exact Mac/Xcode build & upload steps.
3. **[`store/listing.md`](./store/listing.md)** — name, description, keywords, age-rating answers.

## Contributing & roadmap

- **[`CONTRIBUTING.md`](./CONTRIBUTING.md)** — how the layers fit together and how to add a feature.
- **[`ROADMAP.md`](./ROADMAP.md)** — what's shipped and what's next.
