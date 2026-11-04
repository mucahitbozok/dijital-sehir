let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!context) context = new Ctor();
  return context;
}

/** Küçük, dosyasız geri bildirim sesleri. Tarayıcı izin verene kadar sessizdir. */
export function playFeedback(kind: 'correct' | 'wrong' | 'click'): void {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    void ctx.resume();
  }

  const now = ctx.currentTime;
  const notes =
    kind === 'correct'
      ? [
          { freq: 523.25, start: 0, duration: 0.12 },
          { freq: 659.25, start: 0.1, duration: 0.12 },
          { freq: 783.99, start: 0.2, duration: 0.18 },
        ]
      : kind === 'wrong'
        ? [
            { freq: 220, start: 0, duration: 0.16 },
            { freq: 174.61, start: 0.14, duration: 0.22 },
          ]
        : [{ freq: 660, start: 0, duration: 0.05 }];

  for (const note of notes) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = kind === 'wrong' ? 'triangle' : 'sine';
    oscillator.frequency.value = note.freq;
    gain.gain.setValueAtTime(0.0001, now + note.start);
    gain.gain.exponentialRampToValueAtTime(0.08, now + note.start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now + note.start);
    oscillator.stop(now + note.start + note.duration + 0.03);
  }
}
