// Haptic feedback.
//
// IMPORTANT: navigator.vibrate() does NOT work in iOS WKWebView (the runtime
// Capacitor uses). So on a real iPhone the original web game's vibration did
// nothing. Here we route through the native @capacitor/haptics plugin when
// running on a device, and fall back to navigator.vibrate() in a normal
// browser (Android/desktop) for local development.

import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

const isNative = Capacitor?.isNativePlatform?.() ?? false;

/** Light tick for a normal in-turn tap. */
export function hapticTap() {
  if (isNative) {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
  } else if (navigator.vibrate) {
    try {
      navigator.vibrate(20);
    } catch {
      /* no-op */
    }
  }
}

/** Medium triple-buzz for a successful pass. */
export function hapticPass() {
  if (isNative) {
    Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
  } else if (navigator.vibrate) {
    try {
      navigator.vibrate([50, 50, 50]);
    } catch {
      /* no-op */
    }
  }
}

/** Warning buzz for an out-of-turn penalty. */
export function hapticPenalty() {
  if (isNative) {
    Haptics.notification({ type: NotificationType.Warning }).catch(() => {});
  } else if (navigator.vibrate) {
    try {
      navigator.vibrate([100, 50, 100]);
    } catch {
      /* no-op */
    }
  }
}

/** Heavy error pattern for the explosion. */
export function hapticExplode() {
  if (isNative) {
    Haptics.notification({ type: NotificationType.Error }).catch(() => {});
  } else if (navigator.vibrate) {
    try {
      navigator.vibrate([200, 100, 200, 100, 500]);
    } catch {
      /* no-op */
    }
  }
}
