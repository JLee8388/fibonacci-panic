// Pure game engine — the heart of Short Fuze.
//
// This module contains NO DOM, audio, haptics, or timer code. Every function
// is pure: it takes the current state (and, where randomness is involved, an
// injectable `rng`) and returns a brand-new state plus a list of `events`.
// The host (main.js) interprets events to drive sound, vibration, and screen
// flashes. Because the engine is pure and the RNG is injectable, the entire
// rule set is exhaustively unit-testable and deterministic.

import {
  PLAYERS,
  FIB_TOTAL_SECONDS,
  FIB_WARNING_SECONDS,
  TAPS_MIN,
  TAPS_MAX_NORMAL,
  TAPS_MAX_PASS,
  PENALTY_MS,
  MIN_TIME_AFTER_PENALTY_MS,
} from './constants.js';
import { randInt, pick } from './rng.js';

/**
 * @typedef {'menu'|'playing'|'gameover'} Phase
 * @typedef {Object} GameState
 * @property {Phase} phase
 * @property {number} activePlayer   index into PLAYERS
 * @property {number} tapsNeeded
 * @property {number} tapsDone
 * @property {number} timeLeft        milliseconds
 * @property {number} totalTime       milliseconds
 * @property {number} warningThreshold milliseconds (0 = no warning window)
 * @property {Record<number, boolean>} penalties
 * @property {number|null} loser      index into PLAYERS once exploded
 */

/** @returns {GameState} */
export function createInitialState() {
  return {
    phase: 'menu',
    activePlayer: 0,
    tapsNeeded: TAPS_MIN,
    tapsDone: 0,
    timeLeft: 0,
    totalTime: 0,
    warningThreshold: 0,
    penalties: { 0: false, 1: false, 2: false, 3: false },
    loser: null,
  };
}

/**
 * Begin a fresh round. Draws a random Fibonacci length, an independent random
 * warning window strictly shorter than the round, a random starting player and
 * a random tap target.
 * @param {() => number} rng
 * @returns {GameState}
 */
export function startRound(rng) {
  const totalSeconds = pick(rng, FIB_TOTAL_SECONDS);
  const totalTime = totalSeconds * 1000;

  // Warning window must be shorter than the round itself.
  const possibleWarnings = FIB_WARNING_SECONDS.filter((s) => s < totalSeconds);
  const warningSeconds = pick(rng, possibleWarnings);

  return {
    phase: 'playing',
    activePlayer: randInt(rng, 0, PLAYERS.length - 1),
    tapsNeeded: randInt(rng, TAPS_MIN, TAPS_MAX_NORMAL),
    tapsDone: 0,
    timeLeft: totalTime,
    totalTime,
    warningThreshold: warningSeconds * 1000,
    penalties: { 0: false, 1: false, 2: false, 3: false },
    loser: null,
  };
}

/**
 * Whether the round is currently in its "panic" warning window.
 * @param {GameState} state
 */
export function isCritical(state) {
  return state.warningThreshold > 0 && state.timeLeft <= state.warningThreshold;
}

/**
 * Advance the clock by `deltaMs`. Emits 'explode' and transitions to gameover
 * when time runs out.
 * @param {GameState} state
 * @param {number} deltaMs
 * @returns {{state: GameState, events: string[]}}
 */
export function tick(state, deltaMs) {
  if (state.phase !== 'playing') return { state, events: [] };

  const timeLeft = state.timeLeft - deltaMs;
  if (timeLeft <= 0) {
    return {
      state: { ...state, timeLeft: 0, phase: 'gameover', loser: state.activePlayer },
      events: ['explode'],
    };
  }
  return { state: { ...state, timeLeft }, events: [] };
}

/**
 * Handle a player pressing their panel.
 *
 * - Out-of-turn: PENALTY — the bomb jumps to the masher, taps reset, and 2s is
 *   deducted (floored so it can't instantly end the round).
 * - In-turn, target not yet reached: a normal tap.
 * - In-turn, target reached: PASS — the bomb jumps to a *different* random player.
 *
 * @param {GameState} state
 * @param {number} playerId
 * @param {() => number} rng
 * @returns {{state: GameState, events: string[]}}
 */
export function tap(state, playerId, rng) {
  if (state.phase !== 'playing') return { state, events: ['ignored'] };

  // Out-of-turn mashing -> penalty.
  if (playerId !== state.activePlayer) {
    return {
      state: {
        ...state,
        activePlayer: playerId,
        tapsDone: 0,
        tapsNeeded: randInt(rng, TAPS_MIN, TAPS_MAX_NORMAL),
        timeLeft: Math.max(MIN_TIME_AFTER_PENALTY_MS, state.timeLeft - PENALTY_MS),
        penalties: { ...state.penalties, [playerId]: true },
      },
      events: ['penalty'],
    };
  }

  const tapsDone = state.tapsDone + 1;

  // Target reached -> pass the bomb to a different random player.
  if (tapsDone >= state.tapsNeeded) {
    let nextId = state.activePlayer;
    while (nextId === state.activePlayer) {
      nextId = randInt(rng, 0, PLAYERS.length - 1);
    }
    return {
      state: { ...state, activePlayer: nextId, tapsDone: 0, tapsNeeded: randInt(rng, TAPS_MIN, TAPS_MAX_PASS) },
      events: ['pass'],
    };
  }

  // Normal progress tap.
  return { state: { ...state, tapsDone }, events: ['tap'] };
}

/**
 * Clear a player's transient PENALTY! flag (fired by the host on a timer).
 * @param {GameState} state
 * @param {number} playerId
 * @returns {GameState}
 */
export function clearPenalty(state, playerId) {
  if (!state.penalties[playerId]) return state;
  return { ...state, penalties: { ...state.penalties, [playerId]: false } };
}
