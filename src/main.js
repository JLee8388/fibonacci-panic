// Host / wiring layer. Owns the live state, the real-time timer loop, input
// listeners, and the native shell integration (status bar, splash screen). It
// translates engine `events` into sound, haptics, and screen flashes, and
// pushes engine state into the view. No game rules live here.

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

import { PLAYERS, TICK_MS, PENALTY_DISPLAY_MS, RESTART_LOCK_MS } from './constants.js';
import { createInitialState, startRound, tick, tap, clearPenalty } from './engine.js';
import { defaultRng } from './rng.js';
import * as audio from './audio.js';
import * as haptics from './haptics.js';
import * as view from './view.js';

let state = createInitialState();
let loop = null;
const rng = defaultRng;

/** Interpret engine events into audio/haptics/visual side effects. */
function applyEffects(events) {
  for (const event of events) {
    switch (event) {
      case 'tap':
        audio.playSound('tap');
        haptics.hapticTap();
        break;
      case 'pass':
        audio.playSound('pass');
        haptics.hapticPass();
        view.triggerFlash('white');
        break;
      case 'penalty':
        audio.playSound('penalty');
        haptics.hapticPenalty();
        view.triggerFlash('red');
        view.shakeBody();
        break;
      case 'explode':
        audio.playSound('explode');
        haptics.hapticExplode();
        view.triggerFlash('red');
        break;
      default:
        break;
    }
  }
}

function stopLoop() {
  if (loop) {
    clearInterval(loop);
    loop = null;
  }
}

function onExplode() {
  stopLoop();
  view.renderGameOver(state);
  view.lockRestart();
  setTimeout(view.unlockRestart, RESTART_LOCK_MS);
}

function startGame() {
  audio.initAudio();
  state = startRound(rng);
  view.enterArena();
  view.resetBackground();
  view.updateArenaVisuals(state);
  view.renderPlayers(state);

  stopLoop();
  loop = setInterval(() => {
    // Guard the hot loop: a transient render/DOM error must never spam every
    // tick or leave a zombie timer running. On failure we stop cleanly.
    try {
      const result = tick(state, TICK_MS);
      state = result.state;
      if (result.events.includes('explode')) {
        applyEffects(result.events);
        onExplode();
      } else {
        view.updateArenaVisuals(state);
      }
    } catch (err) {
      console.error('Game loop error; stopping round.', err);
      stopLoop();
    }
  }, TICK_MS);
}

function handleTap(playerId) {
  if (state.phase !== 'playing') return;
  try {
    const wasPenalty = playerId !== state.activePlayer;

    const result = tap(state, playerId, rng);
    state = result.state;
    applyEffects(result.events);
    view.renderPlayers(state);

    // A penalty briefly flashes the PENALTY! panel, then clears.
    if (wasPenalty) {
      setTimeout(() => {
        state = clearPenalty(state, playerId);
        if (state.phase === 'playing') view.renderPlayers(state);
      }, PENALTY_DISPLAY_MS);
    }
  } catch (err) {
    console.error('Tap handling error.', err);
  }
}

function wakeUp() {
  audio.unlockAudio();
  state = { ...state, phase: 'menu' };
  view.showMenu();
}

function toggleSound() {
  const next = !audio.isSoundEnabled();
  audio.setSoundEnabled(next);
  view.setSoundIcon(next);
}

async function initNativeShell() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await StatusBar.setStyle({ style: Style.Dark });
  } catch {
    /* status bar not available */
  }
  try {
    await SplashScreen.hide();
  } catch {
    /* splash not available */
  }
}

function bindEvents() {
  view.dom.wake().addEventListener('pointerdown', wakeUp);
  document.getElementById('btn-start').addEventListener('click', startGame);
  view.dom.btnRestart().addEventListener('click', () => {
    if (!view.dom.btnRestart().disabled) startGame();
  });
  document.getElementById('btn-sound').addEventListener('click', toggleSound);

  PLAYERS.forEach((player) => {
    document.getElementById(`player-${player.id}`).addEventListener('pointerdown', (e) => {
      e.preventDefault();
      handleTap(player.id);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (state.phase !== 'playing') return;
    const key = e.key.toLowerCase();
    const player = PLAYERS.find((p) => p.key === key);
    if (player) handleTap(player.id);
  });
}

function boot() {
  try {
    view.refreshIcons();
    bindEvents();
    initNativeShell();
  } catch (err) {
    // Never leave the user on a black screen: surface boot failures.
    console.error('Boot failed.', err);
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}

// Exported for integration tests (jsdom) and potential future reuse. This has
// no effect in the browser bundle beyond attaching to the module scope.
export { startGame, handleTap, wakeUp, toggleSound, applyEffects, boot };
