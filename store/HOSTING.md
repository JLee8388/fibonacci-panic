# Hosting the Support & Privacy Policy pages (free, via GitHub Pages)

Apple requires a **Privacy Policy URL** and a **Support URL** for every app.
This repo already contains a small public website in [`../docs/`](../docs/):

- `docs/index.html` — landing + support page (use as your **Support / Marketing URL**)
- `docs/privacy-policy.html` — the **Privacy Policy URL**
- `docs/.nojekyll` — tells GitHub Pages to serve the files as-is

You just need to turn GitHub Pages on. It's free and takes about a minute.

## One-time setup

1. Support contact email is already set to `questions@ailaunchingpad.com` in the
   `docs/` pages. (Change it later if you ever want a different address.)
2. Merge this PR (or push these files to your **default branch**, `main`).
3. On GitHub, go to the repo → **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Set **Branch** = `main` and **Folder** = `/docs`. Click **Save**.
6. Wait ~1 minute. Pages publishes the site.

## Your live URLs

After Pages finishes building (repo `JLee8388/fibonacci-panic`):

- **Support URL:** `https://jlee8388.github.io/fibonacci-panic/`
- **Privacy Policy URL:** `https://jlee8388.github.io/fibonacci-panic/privacy-policy.html`

Open both in a browser to confirm they load, then paste them into App Store
Connect (Support URL on the version page; Privacy Policy URL under **App Privacy**).

> If you later rename the repository, the URL changes to
> `https://<owner>.github.io/<new-repo-name>/`. Update App Store Connect to match.
