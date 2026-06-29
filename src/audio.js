// Web Audio sound effects. All sounds are synthesized at runtime (no audio
// files to bundle). iOS requires an AudioContext to be created/resumed from a
// user gesture, which is why the game opens with a "tap to wake" screen.

let audioCtx = null;
let enabled = true;

/** Create/resume the AudioContext. Must be called from a user gesture on iOS. */
export function initAudio() {
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return true;
  } catch (e) {
    console.error('Audio Context failed', e);
    return false;
  }
}

/** Play a near-silent blip to unlock audio on iOS following a user gesture. */
export function unlockAudio() {
  if (!initAudio()) return false;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.value = 0.01;
  osc.start(now);
  osc.stop(now + 0.01);
  return true;
}

export function setSoundEnabled(value) {
  enabled = value;
  if (enabled && audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

export function isSoundEnabled() {
  return enabled;
}

/**
 * Play one of the synthesized effects.
 * @param {'tap'|'pass'|'penalty'|'explode'} type
 */
export function playSound(type) {
  if (!enabled || !audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  switch (type) {
    case 'tap':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'pass':
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
    case 'penalty':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 'explode':
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 1.2);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.start(now);
      osc.stop(now + 1.2);
      break;
    default:
      break;
  }
}
