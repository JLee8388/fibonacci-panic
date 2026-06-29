import { describe, it, expect } from 'vitest';
import { createInitialState, startRound, isCritical, tick, tap, clearPenalty } from '../src/engine.js';
import { mulberry32 } from '../src/rng.js';
import {
  PLAYERS,
  FIB_TOTAL_SECONDS,
  TAPS_MIN,
  TAPS_MAX_NORMAL,
  TAPS_MAX_PASS,
  PENALTY_MS,
  MIN_TIME_AFTER_PENALTY_MS,
} from '../src/constants.js';

/** Build a playing state with explicit overrides for deterministic tests. */
function playing(overrides = {}) {
  return {
    phase: 'playing',
    activePlayer: 0,
    tapsNeeded: 3,
    tapsDone: 0,
    timeLeft: 10000,
    totalTime: 10000,
    warningThreshold: 0,
    penalties: { 0: false, 1: false, 2: false, 3: false },
    loser: null,
    ...overrides,
  };
}

describe('createInitialState', () => {
  it('starts on the menu with no loser', () => {
    const s = createInitialState();
    expect(s.phase).toBe('menu');
    expect(s.loser).toBeNull();
    expect(s.timeLeft).toBe(0);
  });
});

describe('startRound', () => {
  it('produces a valid playing state for every seed', () => {
    for (let seed = 0; seed < 200; seed++) {
      const s = startRound(mulberry32(seed));
      expect(s.phase).toBe('playing');
      expect(FIB_TOTAL_SECONDS).toContain(s.totalTime / 1000);
      expect(s.timeLeft).toBe(s.totalTime);
      expect(s.activePlayer).toBeGreaterThanOrEqual(0);
      expect(s.activePlayer).toBeLessThan(PLAYERS.length);
      expect(s.tapsNeeded).toBeGreaterThanOrEqual(TAPS_MIN);
      expect(s.tapsNeeded).toBeLessThanOrEqual(TAPS_MAX_NORMAL);
      // Warning window must be strictly shorter than the round.
      expect(s.warningThreshold).toBeLessThan(s.totalTime);
    }
  });

  it('is deterministic for a given seed', () => {
    expect(startRound(mulberry32(42))).toEqual(startRound(mulberry32(42)));
  });
});

describe('isCritical', () => {
  it('is false when there is no warning window', () => {
    expect(isCritical(playing({ warningThreshold: 0, timeLeft: 1 }))).toBe(false);
  });
  it('is true once time drops into the warning window', () => {
    expect(isCritical(playing({ warningThreshold: 3000, timeLeft: 3000 }))).toBe(true);
    expect(isCritical(playing({ warningThreshold: 3000, timeLeft: 3001 }))).toBe(false);
  });
});

describe('tick', () => {
  it('decrements the clock while playing', () => {
    const { state, events } = tick(playing({ timeLeft: 5000 }), 50);
    expect(state.timeLeft).toBe(4950);
    expect(events).toEqual([]);
  });

  it('explodes and records the active player as the loser when time runs out', () => {
    const { state, events } = tick(playing({ timeLeft: 40, activePlayer: 2 }), 50);
    expect(events).toContain('explode');
    expect(state.phase).toBe('gameover');
    expect(state.loser).toBe(2);
    expect(state.timeLeft).toBe(0);
  });

  it('does nothing when not playing', () => {
    const menu = createInitialState();
    const { state, events } = tick(menu, 50);
    expect(state).toBe(menu);
    expect(events).toEqual([]);
  });
});

describe('tap — normal progress', () => {
  it('increments tapsDone and emits "tap" below the target', () => {
    const { state, events } = tap(playing({ tapsNeeded: 3, tapsDone: 0 }), 0, mulberry32(1));
    expect(state.tapsDone).toBe(1);
    expect(events).toEqual(['tap']);
  });
});

describe('tap — pass', () => {
  it('passes to a DIFFERENT random player when the target is reached', () => {
    for (let seed = 0; seed < 200; seed++) {
      const { state, events } = tap(playing({ activePlayer: 1, tapsNeeded: 3, tapsDone: 2 }), 1, mulberry32(seed));
      expect(events).toEqual(['pass']);
      expect(state.activePlayer).not.toBe(1);
      expect(state.tapsDone).toBe(0);
      expect(state.tapsNeeded).toBeGreaterThanOrEqual(TAPS_MIN);
      expect(state.tapsNeeded).toBeLessThanOrEqual(TAPS_MAX_PASS);
    }
  });
});

describe('tap — penalty (out of turn)', () => {
  it('jumps the bomb to the masher, resets taps, and deducts time', () => {
    const { state, events } = tap(playing({ activePlayer: 0, timeLeft: 10000 }), 3, mulberry32(7));
    expect(events).toEqual(['penalty']);
    expect(state.activePlayer).toBe(3);
    expect(state.tapsDone).toBe(0);
    expect(state.timeLeft).toBe(10000 - PENALTY_MS);
    expect(state.penalties[3]).toBe(true);
    expect(state.tapsNeeded).toBeGreaterThanOrEqual(TAPS_MIN);
    expect(state.tapsNeeded).toBeLessThanOrEqual(TAPS_MAX_NORMAL);
  });

  it('floors the deducted time so a penalty cannot end the round', () => {
    const { state } = tap(playing({ activePlayer: 0, timeLeft: 500 }), 1, mulberry32(7));
    expect(state.timeLeft).toBe(MIN_TIME_AFTER_PENALTY_MS);
    expect(state.phase).toBe('playing');
  });
});

describe('tap — ignored', () => {
  it('does nothing outside the playing phase', () => {
    const over = playing({ phase: 'gameover' });
    const { state, events } = tap(over, 0, mulberry32(1));
    expect(state).toBe(over);
    expect(events).toEqual(['ignored']);
  });
});

describe('clearPenalty', () => {
  it('clears a set penalty flag', () => {
    const s = playing({ penalties: { 0: false, 1: false, 2: true, 3: false } });
    expect(clearPenalty(s, 2).penalties[2]).toBe(false);
  });
  it('returns the same reference when nothing changes', () => {
    const s = playing();
    expect(clearPenalty(s, 2)).toBe(s);
  });
});

describe('determinism', () => {
  it('replays an identical sequence of taps for the same seed', () => {
    const run = () => {
      const rng = mulberry32(123);
      let s = startRound(rng);
      const trace = [];
      for (let i = 0; i < 50; i++) {
        s = tap(s, s.activePlayer, rng).state;
        trace.push([s.activePlayer, s.tapsNeeded, s.tapsDone]);
      }
      return trace;
    };
    expect(run()).toEqual(run());
  });
});
