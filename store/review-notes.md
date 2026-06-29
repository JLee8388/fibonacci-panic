# App Review Notes — Short Fuse

Paste this into **App Store Connect → App Review Information → Notes**. It tells
the reviewer how to evaluate a local multiplayer game and preempts the common
rejection reasons.

---

```
WHAT THIS APP IS
Short Fuse is a self-contained, offline "pass-the-bomb" party game for up to 4
players sharing ONE device. There is no online component, no account, no login,
and no in-app purchases.

HOW TO TEST IT (single reviewer)
1. Launch the app. Tap anywhere on the "tap to wake" screen (this is required to
   enable Web Audio sound on iOS).
2. Tap "EMBRACE CHAOS" to start a round.
3. One of the four colored panels (corners of the screen) lights up as the
   active player and shows "TAP!". Tap that panel repeatedly to pass the bomb.
   It then jumps to a random panel.
4. You can test all four panels yourself. Tapping a panel that is NOT active
   triggers the over-tap penalty (the bomb jumps to that panel and 2 seconds are
   deducted).
5. When the hidden timer runs out, the bomb "explodes" (BOOM screen) and the
   player holding it loses. Tap "PLAY AGAIN" to restart.

NOTES FOR REVIEW
- NATIVE INTEGRATION: The app uses native haptic feedback (Capacitor Haptics)
  and synthesized audio, and respects safe areas / status bar. It is a complete
  native game, not a web view of a website.
- FULLY OFFLINE: No network connectivity is used or required. All assets are
  bundled in the app.
- PRIVACY: No data is collected. No analytics or third-party SDKs.
- CONTENT: The only "violence" is a stylized cartoon bomb that flashes on a
  timeout. No gore, no realism. Rated 9+.
- CONTROLS: Designed for touch (each player taps a corner). Physical-keyboard
  shortcuts (Q/P/Z/M) also map to the four players for convenience on devices
  with a keyboard; they are not required.

No demo account is needed because the app has no login.
```
