# Hosting the Support & Privacy Policy pages (GitHub Pages)

Apple requires a **Privacy Policy URL** and a **Support URL** for every app.
This repo already contains a small public website in [`../docs/`](../docs/):

- `docs/index.html` — landing + support page (your **Support / Marketing URL**)
- `docs/privacy-policy.html` — your **Privacy Policy URL**

## Good news: Pages is already enabled

GitHub Pages is already turned on for this repo and is configured to **deploy
from the `main` branch (root folder)**. Its last build was the old project
content (from before this work). You don't need to enable anything.

## What you need to do: just merge

GitHub Pages auto-rebuilds whenever `main` changes. So:

1. **Merge this PR into `main`.**
2. Pages automatically runs its "pages build and deployment" and publishes the
   updated site (including `docs/`) within a minute or two.
3. Confirm the pages load (see URLs below), then paste them into App Store Connect:
   the **Privacy Policy URL** under *App Privacy*, and the **Support URL** on the
   version page.

## Your live URLs (with the current root configuration)

- **Support URL:** `https://jlee8388.github.io/fibonacci-panic/docs/`
- **Privacy Policy URL:** `https://jlee8388.github.io/fibonacci-panic/docs/privacy-policy.html`

The `/docs/` segment is there because Pages serves from the repo root and the
site lives in the `docs/` folder. This is a perfectly valid URL for Apple.

## Optional: cleaner URLs without `/docs/`

If you'd rather the URLs be `https://jlee8388.github.io/fibonacci-panic/` and
`.../privacy-policy.html` (no `/docs/`), change the Pages **folder** once:

1. Repo → **Settings → Pages → Build and deployment**.
2. Source: **Deploy from a branch**, Branch: **`main`**, Folder: **`/docs`**. Save.
3. Then drop `/docs/` from the two URLs above and update `store/listing.md`.

> If you ever rename the repository, the URLs change to
> `https://<owner>.github.io/<new-repo-name>/...`. Update App Store Connect to match.

## Notes

- The support/privacy contact email is set to `questions@ailaunchingpad.com`.
- A root `.nojekyll` is included so Pages serves the static HTML as-is.
- The site collects no data and matches the app's "Data Not Collected" privacy label.
