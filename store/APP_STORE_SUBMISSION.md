# App Store Submission — Checklist & Stage Gates

This is the end-to-end path to get **Short Fuse** onto the Apple App
Store, plus the hurdles that are specific to *this* app (a simple, offline
party game wrapped from web tech). Work top to bottom.

Legend: 🚪 = hard stage gate (you can't proceed without it) · ⚠️ = review-risk
hurdle (could get the app rejected) · ✅ = already handled in this repo.

> 💡 For the actual data-entry, use [`APP_STORE_CONNECT_CHEATSHEET.md`](./APP_STORE_CONNECT_CHEATSHEET.md)
> — every field in App Store Connect order with copy/paste-ready values. This
> document is the surrounding *process* (gates, hurdles, decisions).

---

## 0. Prerequisites (hard gates)

- [ ] 🚪 **Apple Developer Program membership — paid, $99/year.** A free Apple ID
      is *not* enough to publish. Confirm at <https://developer.apple.com/account>
      that you see "Apple Developer Program" (not just "Apple ID"). If you only
      have a free account, enroll and wait for approval (can take 24–48h, longer
      if Apple requests ID verification or you enroll as an Organization needing
      a D-U-N-S number).
- [ ] 🚪 **A Mac with Xcode 15+.** Required to build, sign, and upload. You have this.
- [x] ✅ A complete, offline, native-wrapped build (Capacitor). No remote code, no CDN.

---

## 1. Identity & accounts

- [ ] Confirm/adjust your **Bundle ID** (reverse-domain, globally unique). A
      sensible default is already set: `com.jlee8388.shortfuse`. You don't need to
      own this domain — it just has to be unique in Apple's system. Change the
      `jlee8388` segment to your name if you prefer, in both:
  - `capacitor.config.json` → `appId`
  - Xcode target → Signing & Capabilities → Bundle Identifier
- [ ] Whatever you choose, make sure both places match exactly.
- [ ] Register the Bundle ID under **Certificates, Identifiers & Profiles**
      (Xcode's "Automatically manage signing" will do this for you on first run).
- [ ] In **App Store Connect** → **Apps → +** → create the app record:
  - Platform: iOS · Name: **Short Fuse** (must be unique store-wide — see ⚠️ below)
  - Primary language, Bundle ID (the one above), SKU (any internal string, e.g. `FIBPANIC001`).

> ⚠️ **App name availability.** "Short Fuse" must not already be taken on
> the App Store. Check by searching the store first. If taken, pick a variant
> (the *display* name can differ from the marketing name). Reserve it early —
> creating the app record locks the name to your account.

---

## 2. Pre-build configuration (in this repo)

- [x] ✅ Web bundle builds offline (`npm run build`).
- [x] ✅ App icon source (`resources/icon.png`, 1024×1024, no alpha).
- [x] ✅ Launch screen art (`resources/splash*.png`).
- [ ] On the Mac, generate the native project and assets (see `docs/IOS_BUILD.md`):
  ```bash
  npm install
  npm run build
  npx cap add ios
  npm i -D @capacitor/assets        # installs fine on macOS (sharp builds there)
  npx @capacitor/assets generate --ios
  npm run cap:sync
  npm run cap:open
  ```
- [ ] In Xcode, set **Display Name**, **Version** (1.0.0) and **Build** (1).
- [ ] Set **Deployment Target** to iOS 14.0+ (matches the build target).
- [ ] **Device family:** recommend **iPhone only** for v1 (halves your screenshot
      work and avoids iPad layout review). Uncheck iPad in the target's General tab.
- [ ] **Orientation:** the game is portrait-first. Lock to Portrait in Xcode
      (General → Deployment Info) unless you want to test/screenshot landscape too.

---

## 3. Build, sign & upload (on the Mac)

- [ ] Select **Any iOS Device (arm64)** as the run destination.
- [ ] Xcode → **Product → Archive**.
- [ ] In the Organizer → **Distribute App → App Store Connect → Upload**.
- [ ] Signing: use **Automatically manage signing** with your Team selected.
- [ ] Wait for the build to finish **processing** in App Store Connect (5–30 min;
      you'll get an email). See `docs/IOS_BUILD.md` for the detailed walkthrough.

> 🚪 **Export compliance.** On upload Xcode asks about encryption. This app uses
> no encryption beyond standard system HTTPS/none and collects nothing, so you
> answer **"No"** to using non-exempt encryption. (You can pre-set this with
> `ITSAppUsesNonExemptEncryption = NO` in Info.plist — see build doc.)

---

## 4. App Store Connect listing

Fill these from [`store/listing.md`](./listing.md):

- [ ] **Name**, **Subtitle**, **Promotional text**, **Description**, **Keywords**.
- [ ] **Support URL** and (optional) **Marketing URL** — a ready-made landing page
      ships in `docs/index.html`. GitHub Pages is already enabled (serves `main`/root),
      so after this PR merges use `https://jlee8388.github.io/fibonacci-panic/docs/`.
      See [`store/HOSTING.md`](./HOSTING.md).
- [ ] **Category:** Primary **Games → Casual**; Secondary **Games → Family** (optional).
- [ ] 🚪 **Privacy Policy URL** — required for every app. A hosted policy ships in
      `docs/privacy-policy.html`. After merge, use
      `https://jlee8388.github.io/fibonacci-panic/docs/privacy-policy.html`.
      (Support contact email is already set to `questions@ailaunchingpad.com`.)
- [ ] 🚪 **App Privacy ("nutrition label").** Answer the questionnaire:
      this app **collects no data** → choose **"Data Not Collected."** (No
      analytics, no accounts, no network calls.)
- [ ] 🚪 **Age rating questionnaire.** See [`store/listing.md`](./listing.md) for the
      exact answers. Cartoon bomb/explosion → expect a **9+** rating
      ("Infrequent/Mild Cartoon or Fantasy Violence").
- [ ] 🚪 **Screenshots.** Pre-generated at Apple's exact sizes in
      `store/screenshots/` — **6.9"** (1320×2868) and **6.7"** (1290×2796), four
      scenes each: menu, active round, panic/critical, and BOOM game-over. Upload
      these directly, or re-capture from the iOS Simulator if you prefer (see
      `docs/IOS_BUILD.md`). If you kept iPad enabled, you must also supply 13" iPad shots.
- [ ] **App icon** is taken from the build automatically (1024 marketing icon).
- [ ] **Copyright**, e.g. `2026 <Your Name>`.
- [ ] **Pricing & Availability:** set Free (or a tier), choose territories.
- [ ] **Review notes & demo:** paste [`store/review-notes.md`](./review-notes.md).
      No login is needed, so no demo account required.

---

## 5. ⚠️ Review-risk hurdles specific to this app

These are the realistic reasons a simple party game gets bounced. Read before
submitting.

- ⚠️ **Guideline 4.2 — Minimum Functionality.** Apple rejects apps that feel like
      a repackaged web page or are "too simple." Mitigations already in place:
      fully **offline**, **native haptics** via Capacitor, real synthesized audio,
      polished UI, no browser chrome. In the review notes, emphasize it's a
      complete, self-contained game with native device feedback — not a web bookmark.
- ⚠️ **Guideline 4.3 — Spam / Saturation.** "Pass-the-bomb" party games are a
      crowded genre; clones get rejected. Your differentiators: the **randomized
      Fibonacci timer**, **random turn order**, **random warning window**, and the
      **over-tap penalty** — call these out as original mechanics. Use the
      **original artwork** in this repo (don't ship stock bomb clip-art).
- ⚠️ **Guideline 2.1 — Completeness.** No placeholder text, no `com.example`
      bundle ID, working links. Double-check before submitting.
- ⚠️ **Performance / battery.** The game runs a 50 ms `setInterval`. It's light,
      but make sure the loop stops on game over (it does) so it doesn't drain
      battery in the background.
- ⚠️ **iPad (if enabled).** If iPad stays on, the 2×2 layout must look correct on
      a large screen and you owe iPad screenshots. Easiest path: ship iPhone-only first.

---

## 6. Submit

- [ ] Attach the processed build to the version.
- [ ] **Add for Review → Submit.**
- [ ] Choose **manual** or **automatic** release.
- [ ] Typical review time: **24–48 hours**. If rejected, Apple cites the
      guideline number in Resolution Center — map it to section 5 above and respond.

---

## Quick reference: what's already done vs. what's on you

| Done in this repo ✅ | Needs you (on the Mac / in App Store Connect) |
| --- | --- |
| Offline build, no remote code | Paid Developer Program membership |
| Modular, tested codebase + CI | Unique Bundle ID + app record |
| App icon + splash sources | `npx cap add ios`, asset generation, archive & upload |
| Listing copy, privacy policy, review notes, age-rating answers | Host privacy/support URLs, capture screenshots |
| Native haptics, safe-area, status bar | Final signing with your Team, submit for review |
