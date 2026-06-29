// View layer: everything that touches the DOM. It renders from engine state
// but holds no game rules of its own, so the rules stay unit-testable in
// engine.js. `lucide` is provided globally by the vendored assets/lucide.min.js.

import { PLAYERS } from './constants.js';
import { isCritical } from './engine.js';

const el = (id) => document.getElementById(id);

export const dom = {
  body: () => el('body-container'),
  wake: () => el('screen-wake'),
  menu: () => el('screen-menu'),
  gameover: () => el('screen-gameover'),
  arena: () => el('screen-arena'),
  soundControls: () => el('sound-controls'),
  flash: () => el('flash-overlay'),
  bombContainer: () => el('bomb-container'),
  mainBomb: () => el('main-bomb'),
  bombRing: () => el('bomb-ping-ring'),
  loserBox: () => el('loser-name-box'),
  statsText: () => el('stats-text'),
  btnRestart: () => el('btn-restart'),
};

export function refreshIcons() {
  if (window.lucide) lucide.createIcons();
}

export function showMenu() {
  dom.wake().classList.add('hidden');
  dom.menu().classList.remove('hidden');
  dom.soundControls().classList.remove('hidden');
}

export function enterArena() {
  dom.menu().classList.add('hidden');
  dom.gameover().classList.add('hidden');
  dom.arena().classList.remove('hidden');
}

export function triggerFlash(color) {
  const flash = dom.flash();
  flash.style.backgroundColor = color;
  flash.style.opacity = color === 'white' ? '0.4' : '0.6';
  flash.classList.remove('hidden');
  setTimeout(() => flash.classList.add('hidden'), 150);
}

export function shakeBody() {
  const body = dom.body();
  body.classList.add('animate-violently-shake');
  setTimeout(() => body.classList.remove('animate-violently-shake'), 300);
}

/** Update the central bomb + background to reflect the panic warning window. */
export function updateArenaVisuals(state) {
  if (state.phase !== 'playing') return;
  const critical = isCritical(state);
  const body = dom.body();
  const bombContainer = dom.bombContainer();
  const mainBomb = dom.mainBomb();
  const bombRing = dom.bombRing();

  if (critical) {
    body.classList.remove('bg-neutral-900');
    body.classList.add('bg-rose-950');
    bombContainer.classList.remove('border-neutral-700');
    bombContainer.classList.add('border-rose-500');
    mainBomb.classList.remove('text-neutral-400', 'bomb-pulse');
    mainBomb.classList.add('text-rose-500', 'bomb-ping');
    bombRing.classList.remove('hidden');
  } else {
    body.classList.add('bg-neutral-900');
    body.classList.remove('bg-rose-950');
    bombContainer.classList.add('border-neutral-700');
    bombContainer.classList.remove('border-rose-500');
    mainBomb.classList.add('text-neutral-400', 'bomb-pulse');
    mainBomb.classList.remove('text-rose-500', 'bomb-ping');
    bombRing.classList.add('hidden');
  }
}

export function resetBackground() {
  const body = dom.body();
  body.classList.add('bg-neutral-900');
  body.classList.remove('bg-rose-950', 'animate-violently-shake');
}

/** Render the four player panels from state. */
export function renderPlayers(state) {
  PLAYERS.forEach((player) => {
    const node = el(`player-${player.id}`);
    const isActive = state.activePlayer === player.id;
    const isPenalized = state.penalties[player.id];

    node.className = `player-btn relative flex-1 flex flex-col w-full h-full items-center justify-center rounded-3xl md:rounded-[3rem] transition-all duration-150 cursor-pointer overflow-hidden ${
      player.id < 2 ? 'rotate-180' : ''
    }`;

    if (isPenalized) {
      node.classList.add(
        'bg-rose-600',
        'border-[6px]',
        'border-white',
        'z-30',
        'animate-violently-shake',
        'shadow-[0_0_50px_rgba(225,29,72,0.8)]',
      );
      node.innerHTML = `
        <i data-lucide="alert-triangle" class="text-white w-16 h-16 mb-4 animate-bounce"></i>
        <span class="text-3xl md:text-5xl font-black text-white text-center leading-tight">
          PENALTY!<br/><span class="text-2xl md:text-4xl">-2 SEC</span>
        </span>
      `;
    } else if (isActive) {
      node.classList.add(
        player.colorBg,
        player.shadow,
        'shadow-[0_0_40px_rgba(0,0,0,0.6)]',
        'scale-[1.02]',
        'z-10',
        'border-[4px]',
        'md:border-[6px]',
        'border-white',
      );
      const percent = (state.tapsDone / state.tapsNeeded) * 100;
      node.innerHTML = `
        <span class="text-3xl md:text-5xl font-black mb-2 md:mb-4 opacity-90 tracking-wider">${player.name}</span>
        <div class="h-20 md:h-24 flex items-center justify-center">
          <div class="flex flex-col items-center animate-bounce-custom">
            <span class="text-4xl md:text-6xl font-black">TAP!</span>
            <span class="text-lg md:text-2xl font-bold opacity-80 mt-1">${state.tapsNeeded - state.tapsDone} LEFT</span>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 h-4 md:h-6 bg-white/30 transition-all duration-150" style="width: ${percent}%"></div>
      `;
    } else {
      node.classList.add('bg-neutral-800/60', 'border-2', 'border-neutral-700', 'opacity-60', 'scale-[0.98]');
      node.innerHTML = `
        <span class="text-3xl md:text-5xl font-black mb-2 md:mb-4 opacity-90 tracking-wider">${player.name}</span>
        <div class="h-20 md:h-24 flex items-center justify-center">
          <span class="text-sm md:text-xl font-bold opacity-30">Key: ${player.key.toUpperCase()}</span>
        </div>
      `;
    }
  });
  refreshIcons();
}

/** Render the game-over screen; returns nothing (host manages the restart lock). */
export function renderGameOver(state) {
  dom.arena().classList.add('hidden');
  dom.gameover().classList.remove('hidden');
  resetBackground();

  const loser = PLAYERS[state.loser];
  const loserBox = dom.loserBox();
  loserBox.className = `text-5xl font-bold my-8 py-6 px-10 rounded-3xl inline-block shadow-[0_0_50px_rgba(0,0,0,0.5)] ${loser.colorBg}`;
  loserBox.innerText = `${loser.name} loses!`;
  dom.statsText().innerText = `Round length: ${state.totalTime / 1000}s | Warning: ${state.warningThreshold / 1000}s`;
}

export function lockRestart() {
  const btn = dom.btnRestart();
  btn.disabled = true;
  btn.className =
    'flex items-center gap-3 px-10 py-5 rounded-full font-black text-2xl transition-all duration-300 bg-neutral-800 text-neutral-500 cursor-not-allowed border-2 border-neutral-700 opacity-80';
  el('restart-icon').setAttribute('data-lucide', 'lock');
  el('restart-text').innerText = 'WAIT...';
  refreshIcons();
}

export function unlockRestart() {
  const btn = dom.btnRestart();
  btn.disabled = false;
  btn.className =
    'flex items-center gap-3 px-10 py-5 rounded-full font-black text-2xl transition-all duration-300 bg-white text-neutral-900 hover:bg-neutral-200 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)]';
  el('restart-icon').setAttribute('data-lucide', 'rotate-ccw');
  el('restart-text').innerText = 'PLAY AGAIN';
  refreshIcons();
}

export function setSoundIcon(on) {
  el('icon-sound-on').classList.toggle('hidden', !on);
  el('icon-sound-off').classList.toggle('hidden', on);
}
