# App Store Screenshots

Pre-generated at Apple's exact required pixel sizes, rendered from the real game
build (not mockups). Upload directly in App Store Connect, or re-capture from the
iOS Simulator if you'd rather.

| Folder | Device class | Pixel size (portrait) |
| --- | --- | --- |
| `6.9/` | 6.9" iPhone (e.g. iPhone 16 Pro Max) | 1320 × 2868 |
| `6.7/` | 6.7" iPhone (e.g. iPhone 15 Pro Max) | 1290 × 2796 |

Each folder contains four scenes:

1. `01-menu.png` — title + rules screen
2. `02-round.png` — an active round (a player's panel lit with "TAP!")
3. `03-panic.png` — the red "about to blow" critical state
4. `04-boom.png` — the BOOM game-over screen

Uploading the **6.9"** set is sufficient for current App Store Connect; the
6.7" set is included for completeness. Regenerate after UI changes with
`scripts/gen-screenshots` (see repo scripts) using a local Chromium/Playwright.

> Tip: App Store Connect also lets you add a caption/marketing frame around
> these. The raw gameplay shots here are accepted as-is.
