# App Store Connect — Copy/Paste Cheat Sheet

Every field you'll fill in App Store Connect, **in the order you hit them**, with
the exact value to paste. Anything in `‹angle brackets›` is the only stuff that's
truly yours to supply (phone number, etc.). Check each box as you go.

Legend: 📋 = paste the value as-is · ✏️ = your input needed · ☑️ = pick the option

---

## Step 1 — Create the app
**App Store Connect → Apps → ➕ → New App**

- ☑️ **Platforms:** iOS
- 📋 **Name:** `Short Fuse`
  - ⚠️ If "Short Fuse" is taken, use a fallback: `Short Fuse: Party Bomb` or `Short Fuse - Pass the Bomb`
- ☑️ **Primary Language:** `English (U.S.)`
- ☑️ **Bundle ID:** select `com.jlee8388.shortfuse` (it appears here after your first Xcode upload/registration)
- 📋 **SKU:** `SHORTFUSE001`  _(internal only, never shown publicly — any unique string works)_
- ☑️ **User Access:** Full Access

---

## Step 2 — App Information
**App → General → App Information**

- 📋 **Subtitle:** `4-player party bomb game`
- ☑️ **Category → Primary:** `Games`  → Subcategory: `Casual`
- ☑️ **Category → Secondary (optional):** `Games` → Subcategory: `Family`
- ☑️ **Content Rights:** "Does your app contain, show, or access third-party content?" → **No**
- 🔢 **Age Rating:** click **Edit** and answer per **Step 6** below (you'll land on **9+**).

---

## Step 3 — Pricing and Availability
**App → Pricing and Availability**

- ☑️ **Price:** `Free` (USD 0 — Tier 0)
- ☑️ **Availability:** All countries and regions (or pick your subset)

---

## Step 4 — App Privacy
**App → App Privacy**

- 📋 **Privacy Policy URL:** `https://jlee8388.github.io/fibonacci-panic/docs/privacy-policy.html`
  - _(Live after you merge the PR — see `store/HOSTING.md`.)_
- ☑️ **Data Collection:** click **Get Started** → answer **"No, we do not collect data from this app."**
  - Result: the label shows **Data Not Collected**. No further questions.

---

## Step 5 — Version Information (the "1.0 Prepare for Submission" page)

- 📋 **Promotional Text:**
  ```
  Gather your crew, pass the bomb, and don't be holding it when the fuse runs out. Random timers, random turns, pure panic. The fastest taps survive.
  ```
- 📋 **Description:**
  ```
  Short Fuse is the fast, loud, pass-the-bomb party game for you and three friends — all on one phone.

  Pass the bomb before the fuse burns out. Whoever's holding it when it blows takes the L. The catch? Nothing is predictable.

  CHAOS BY DESIGN
  • RANDOM TURN ORDER — the bomb jumps to a totally random player every time it's passed. No taking turns in a circle.
  • THE FUSE IS A MYSTERY — each round secretly runs on a different timer (8, 13, 21, or 34 seconds). You never know how long you've got.
  • SURPRISE PANIC WARNING — the red "it's about to blow" warning kicks in at a random time. Sometimes you get 8 seconds of dread. Sometimes none at all.
  • OVER-TAP PENALTY — mash your panel when it isn't your turn and the bomb snaps right back to you... minus 2 seconds. Stay sharp.

  HOW TO PLAY
  • 4 players, one phone — each person takes a corner of the screen.
  • When the bomb lands on you, tap your panel fast to pass it on.
  • Don't be holding it at zero. BOOM.

  WHY YOU'LL LOVE IT
  • Instant fun — no setup, no accounts, no rules lawyer needed.
  • Plays anywhere — works completely offline.
  • Punchy sound and real haptic feedback that make every pass land.
  • Quick rounds, endless rematches ("PLAY AGAIN" is right there).

  No sign-ups. No ads interrupting your game. No internet required. Just four thumbs, one bomb, and a very short fuse.
  ```
- 📋 **Keywords:**
  ```
  party,bomb,multiplayer,friends,reaction,tap,fast,group,couch,local,family,arcade,timer,chaos,reflex
  ```
- 📋 **Support URL:** `https://jlee8388.github.io/fibonacci-panic/docs/`
- 📋 **Marketing URL (optional):** `https://jlee8388.github.io/fibonacci-panic/docs/`

### Screenshots (drag-and-drop)
- 📁 **6.9" Display:** upload the 4 files in `store/screenshots/6.9/` (1320×2868)
  - `01-menu.png`, `02-round.png`, `03-panic.png`, `04-boom.png`
- 📁 **6.7" Display (optional but included):** the 4 files in `store/screenshots/6.7/` (1290×2796)

### Build
- ☑️ **Build:** click ➕ and select the build you uploaded from Xcode (after it finishes processing).

### General
- 📋 **Version:** `1.0`
- 📋 **Copyright:** `2026 ‹Your name or company›`  _(e.g. `2026 Jason Y Lee`)_
- **What's New in This Version:** _(leave blank for a first release; for updates use `Initial release. Pass the bomb, survive the fuse, blame your friends.`)_

### App Review Information
- ✏️ **First / Last name:** `‹your name›`
- ✏️ **Phone number:** `‹your phone›`
- 📋 **Email:** `questions@ailaunchingpad.com`
- ☑️ **Sign-in required:** **No** (uncheck "Sign-in required" — there's no login)
- **Demo account:** leave blank (not needed)
- 📋 **Notes:**
  ```
  WHAT THIS APP IS
  Short Fuse is a self-contained, offline "pass-the-bomb" party game for up to 4
  players sharing ONE device. No online component, no account, no login, no IAP.

  HOW TO TEST IT (single reviewer)
  1. Launch the app. Tap anywhere on the "tap to wake" screen (required to enable
     Web Audio sound on iOS).
  2. Tap "EMBRACE CHAOS" to start a round.
  3. One of the four colored panels (corners) lights up as the active player and
     shows "TAP!". Tap it repeatedly to pass the bomb; it jumps to a random panel.
  4. You can test all four panels yourself. Tapping a NON-active panel triggers the
     over-tap penalty (the bomb jumps there and 2 seconds are deducted).
  5. When the hidden timer runs out, the bomb "explodes" (BOOM screen) and the
     player holding it loses. Tap "PLAY AGAIN" to restart.

  NOTES FOR REVIEW
  - Native haptics (Capacitor) and synthesized audio; respects safe areas/status bar.
    A complete native game, not a web view of a website.
  - Fully offline — no network connectivity used or required.
  - No data collected; no analytics or third-party SDKs.
  - Only "violence" is a stylized cartoon bomb that flashes on a timeout. Rated 9+.
  - Keyboard keys Q/P/Z/M also map to the four players on devices with a keyboard;
    not required for touch play.

  No demo account is needed because the app has no login.
  ```

---

## Step 6 — Age Rating questionnaire (the **Edit** dialog from Step 2)

Answer each; everything is None/No except the one violence line:

| Question | Answer |
| --- | --- |
| Cartoon or Fantasy Violence | **Infrequent/Mild** |
| Realistic Violence | None |
| Prolonged Graphic or Sadistic Realistic Violence | None |
| Sexual Content or Nudity | None |
| Profanity or Crude Humor | None |
| Alcohol, Tobacco, or Drug Use or References | **None** |
| Mature/Suggestive Themes | None |
| Horror/Fear Themes | None |
| Medical/Treatment Information | None |
| Gambling (simulated) | None |
| Contests | None |
| Unrestricted Web Access | **No** |
| Does your app contain... in-app purchases / Kids Category | No / leave Kids Category off |

➡️ **Expected result: 9+.**

---

## Step 7 — Upload the build (done in Xcode, not the browser)

This happens on your Mac before the Build picker in Step 5 works. See
[`../docs/IOS_BUILD.md`](../docs/IOS_BUILD.md). Two answers to have ready:

- ☑️ **Signing:** "Automatically manage signing", your Team selected.
- ☑️ **Export Compliance:** "Does your app use encryption?" → **No**
  - Pre-answer it by adding to `ios/App/App/Info.plist`:
    ```xml
    <key>ITSAppUsesNonExemptEncryption</key>
    <false/>
    ```

---

## Step 8 — Submit

- ☑️ Confirm the build is attached (Step 5).
- ☑️ **Add for Review → Submit for Review.**
- ☑️ **Release:** choose **Automatically release** (or Manual if you want to press the button yourself).
- ⏱️ Review usually takes 24–48h. If rejected, Apple cites a guideline number —
  map it to §5 of [`APP_STORE_SUBMISSION.md`](./APP_STORE_SUBMISSION.md) and reply.

---

## The only things that are genuinely yours to fill

1. `‹Your name›` for Copyright + App Review contact name
2. `‹your phone›` for the App Review contact
3. Pick **Short Fuse** vs. a fallback name if it's taken
4. (Optional) change `com.jlee8388.shortfuse` to your own name segment

Everything else is paste-as-is.
