// Game constants. Kept free of any DOM/browser references so they can be
// imported by both the engine (pure) and the view (browser) layers, and by
// the test suite running under Node.

export const PLAYERS = [
  { id: 0, name: 'Red', colorBg: 'bg-rose-500', colorText: 'text-rose-500', shadow: 'shadow-rose-600', key: 'q' },
  { id: 1, name: 'Blue', colorBg: 'bg-blue-600', colorText: 'text-blue-600', shadow: 'shadow-blue-700', key: 'p' },
  {
    id: 2,
    name: 'Green',
    colorBg: 'bg-emerald-500',
    colorText: 'text-emerald-500',
    shadow: 'shadow-emerald-600',
    key: 'z',
  },
  { id: 3, name: 'Yellow', colorBg: 'bg-amber-400', colorText: 'text-amber-400', shadow: 'shadow-amber-500', key: 'm' },
];

// Total round length is randomly drawn from these Fibonacci seconds.
export const FIB_TOTAL_SECONDS = [8, 13, 21, 34];

// The "panic" visual warning window (seconds) is independently randomized.
export const FIB_WARNING_SECONDS = [0, 1, 2, 3, 5, 8];

// Tap counts (inclusive ranges).
export const TAPS_MIN = 3;
export const TAPS_MAX_NORMAL = 6; // start-of-round and penalty re-rolls
export const TAPS_MAX_PASS = 7; // after a successful pass

// Timing.
export const TICK_MS = 50; // game-loop resolution
export const PENALTY_MS = 2000; // time deducted on an out-of-turn tap
export const MIN_TIME_AFTER_PENALTY_MS = 10; // floor so a penalty can't end the round
export const PENALTY_DISPLAY_MS = 1000; // how long the PENALTY! flash shows
export const RESTART_LOCK_MS = 1500; // anti-mash lock on the game-over screen
