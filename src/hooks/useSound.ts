/** Lightweight audio hook using the Web Audio API. Zero dependencies. */

import { isSoundEnabled } from './useStorage';

let audioElement: HTMLAudioElement | null = null;

export function playBlip(): void {
  if (!isSoundEnabled()) return;
  try {
    if (!audioElement) {
      audioElement = new Audio('/sounds/blip.wav');
      audioElement.volume = 0.4;
    }
    audioElement.currentTime = 0;
    audioElement.play().catch(() => {});
  } catch {
    // Silently ignore — sound is non-essential
  }
}
