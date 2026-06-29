// Random-number utilities.
//
// The whole game is driven by randomness (which player is active, how many
// taps are needed, the Fibonacci timer length, the warning window). To make
// that logic deterministically testable, every consumer takes an injectable
// `rng` — a function returning a float in [0, 1) — instead of calling
// Math.random() directly. Production uses `defaultRng`; tests use `mulberry32`
// with a fixed seed.

/**
 * Seedable pseudo-random generator (mulberry32). Same seed -> same sequence,
 * which is what makes the engine unit-testable.
 * @param {number} seed
 * @returns {() => number} rng producing floats in [0, 1)
 */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Production RNG. */
export const defaultRng = () => Math.random();

/**
 * Integer in [min, max] inclusive.
 * @param {() => number} rng
 * @param {number} min
 * @param {number} max inclusive
 */
export function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Pick a random element from a non-empty array.
 * @template T
 * @param {() => number} rng
 * @param {T[]} arr
 * @returns {T}
 */
export function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}
