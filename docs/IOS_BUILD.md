# iOS Build Guide — Short Fuse

Everything needed to turn this repo into a signed app on your iPhone and an
upload to App Store Connect. **All of this runs on your Mac** (Apple requires
macOS + Xcode to build and sign iOS apps).

> Companion docs: [`../store/APP_STORE_SUBMISSION.md`](../store/APP_STORE_SUBMISSION.md)
> (the store checklist) and [`../store/listing.md`](../store/listing.md) (the copy).

---

## 0. One-time setup

- **Xcode 15+** from the Mac App Store. Open it once to install components.
- **Command Line Tools:** `xcode-select --install`
- **CocoaPods** (Capacitor uses it): `sudo gem install cocoapods` (or `brew install cocoapods`)
- **Node 18+**: `brew install node`
- Sign in to Xcode with your Apple ID under **Xcode → Settings → Accounts**, and
  make sure your **Apple Developer Program** team appears there.

---

## 1. Build the web bundle

```bash
npm install
npm run build      # compiles Tailwind, vendors Lucide, bundles src/ -> www/assets
npm test           # optional but recommended: 21 unit + integration tests
```

This produces the offline assets in `www/` that the native app loads.

## 2. Add the native iOS project

```bash
npx cap add ios
```

This generates the `ios/` Xcode project (git-ignored by default). It reads
`capacitor.config.json`, so the app name (**Short Fuse**) and bundle id come
from there.

> 🔧 **Change the bundle id first.** Edit `capacitor.config.json` →
> `"appId"` from the placeholder `com.example.shortfuse` to your own
> reverse-domain id (e.g. `com.yourname.shortfuse`) **before** `cap add ios`,
> or change it later in Xcode under Signing & Capabilities.

## 3. Generate app icons & launch screen

On macOS, `sharp` installs cleanly, so the asset generator works here (it
couldn't run in the Linux dev container, which is why the source art lives in
`resources/`):

```bash
npm i -D @capacitor/assets
npx @capacitor/assets generate --ios
```

This expands `resources/icon.png` and `resources/splash*.png` into every iOS
icon size and the launch storyboard.

## 4. Sync and open in Xcode

```bash
npm run cap:sync   # = npm run build && cap sync ios
npm run cap:open   # opens ios/App/App.xcworkspace in Xcode
```

## 5. Configure the target in Xcode

In the **App** target:

- **General → Identity:** Display Name `Short Fuse`, Version `1.0.0`, Build `1`.
- **General → Deployment Info:** Deployment Target `iOS 14.0`; set **iPhone**
  only (uncheck iPad for v1); Portrait orientation.
- **Signing & Capabilities:** check **Automatically manage signing**, pick your
  **Team**. Xcode registers the bundle id and provisioning profile for you.
- **Export compliance (recommended):** add a key to `ios/App/App/Info.plist`:
  ```xml
  <key>ITSAppUsesNonExemptEncryption</key>
  <false/>
  ```
  This makes the upload skip the encryption question (the app uses none).

## 6. Run on a device / simulator

- Pick a Simulator (e.g. iPhone 15 Pro) or your plugged-in iPhone, press **Run** (▶).
- For **screenshots** (required for the listing): run a 6.7"/6.9" simulator,
  then **Device → Screenshots** or `Cmd-S` in the Simulator. Capture: the menu,
  an active round (a colored panel showing TAP!), the red "panic" state, and the
  BOOM game-over screen.

## 7. Archive and upload

1. Set the run destination to **Any iOS Device (arm64)**.
2. **Product → Archive**.
3. In the **Organizer**, select the archive → **Distribute App** →
   **App Store Connect** → **Upload**.
4. Keep **Automatically manage signing**. Finish the wizard.
5. The build appears in App Store Connect under your app's **TestFlight /
   Build** section after processing (5–30 min; you'll get an email).

## 8. Finish in App Store Connect

Follow [`../store/APP_STORE_SUBMISSION.md`](../store/APP_STORE_SUBMISSION.md) §4–6:
attach the build, fill the listing, set privacy + age rating, add screenshots,
and submit for review.

---

## Iterating later

After any code change:

```bash
npm run cap:sync   # rebuild web + copy into the iOS project
```

Then re-archive in Xcode (bump the **Build** number each upload).

## Troubleshooting

- **`pod install` fails:** ensure CocoaPods is installed and run
  `cd ios/App && pod install` manually.
- **White screen on launch:** confirm `npm run build` ran and `www/assets/app.js`
  exists before `cap sync`.
- **Signing errors:** verify your Developer Program team is selected and your
  device is registered (Xcode does this automatically on first run).
