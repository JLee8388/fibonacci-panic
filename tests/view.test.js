// @vitest-environment jsdom
//
// Functional integration test: drives the REAL www/index.html markup through
// the engine + view layers under jsdom. This guards the DOM contract — element
// IDs, class toggling, injected panel content — that the pure engine tests
// cannot see. If markup IDs drift away from view.js, these tests fail loudly.

import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import * as view from '../src/view.js';
import { startRound, tap, isCritical } from '../src/engine.js';
import { mulberry32 } from '../src/rng.js';
import { PLAYERS } from '../src/constants.js';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(resolve(here, '../www/index.html'), 'utf8');
const bodyTag = html.match(/<body([^>]*)>/i)[1];
const bodyInner = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1];
const bodyId = (bodyTag.match(/id="([^"]+)"/) || [])[1];
const bodyClass = (bodyTag.match(/class="([^"]+)"/) || [])[1] || '';

beforeEach(() => {
  // Reproduce the real <body> element (which carries id="body-container" and
  // the base classes) since innerHTML alone doesn't restore the body tag.
  document.body.innerHTML = bodyInner;
  if (bodyId) document.body.id = bodyId;
  document.body.className = bodyClass;
});

describe('renderPlayers (jsdom)', () => {
  it('marks the active panel with TAP! and others with their key hint', () => {
    const state = startRound(mulberry32(3));
    view.renderPlayers(state);

    const active = document.getElementById(`player-${state.activePlayer}`);
    expect(active.innerHTML).toContain('TAP!');
    expect(active.className).toContain(PLAYERS[state.activePlayer].colorBg);

    const other = PLAYERS.find((p) => p.id !== state.activePlayer).id;
    expect(document.getElementById(`player-${other}`).innerHTML).toContain('Key:');
  });

  it('shows the PENALTY panel for a player who tapped out of turn', () => {
    let state = startRound(mulberry32(3));
    const masher = PLAYERS.find((p) => p.id !== state.activePlayer).id;
    state = tap(state, masher, mulberry32(9)).state;
    view.renderPlayers(state);
    expect(document.getElementById(`player-${masher}`).innerHTML).toContain('PENALTY');
  });
});

describe('updateArenaVisuals (jsdom)', () => {
  it('adds panic styling only inside the warning window', () => {
    const calm = { ...startRound(mulberry32(1)), warningThreshold: 3000, timeLeft: 8000 };
    expect(isCritical(calm)).toBe(false);
    view.updateArenaVisuals(calm);
    expect(document.getElementById('body-container').classList.contains('bg-rose-950')).toBe(false);

    const panic = { ...calm, timeLeft: 2000 };
    expect(isCritical(panic)).toBe(true);
    view.updateArenaVisuals(panic);
    expect(document.getElementById('body-container').classList.contains('bg-rose-950')).toBe(true);
    expect(document.getElementById('bomb-ping-ring').classList.contains('hidden')).toBe(false);
  });
});

describe('renderGameOver (jsdom)', () => {
  it('reveals the game-over screen and tints the loser box', () => {
    const state = {
      ...startRound(mulberry32(1)),
      phase: 'gameover',
      loser: 2,
      totalTime: 13000,
      warningThreshold: 3000,
    };
    view.renderGameOver(state);
    expect(document.getElementById('screen-gameover').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('loser-name-box').className).toContain(PLAYERS[2].colorBg);
  });
});

describe('restart lock (jsdom)', () => {
  it('disables then re-enables the restart button', () => {
    view.lockRestart();
    expect(document.getElementById('btn-restart').disabled).toBe(true);
    view.unlockRestart();
    expect(document.getElementById('btn-restart').disabled).toBe(false);
  });
});
