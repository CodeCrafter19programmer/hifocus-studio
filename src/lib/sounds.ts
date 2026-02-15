// Web Audio API synthesized sounds — no audio files needed

export type SoundId = "none" | "chime" | "bell" | "digital" | "gentle" | "radar";

export interface SoundOption {
  id: SoundId;
  label: string;
  description: string;
}

export const soundOptions: SoundOption[] = [
  { id: "none", label: "None", description: "Silent" },
  { id: "chime", label: "Chime", description: "Soft wind chime" },
  { id: "bell", label: "Bell", description: "Classic bell ring" },
  { id: "digital", label: "Digital", description: "Electronic beeps" },
  { id: "gentle", label: "Gentle", description: "Warm soft tone" },
  { id: "radar", label: "Radar", description: "Pulsing alert" },
];

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.3, delay = 0) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  g.gain.setValueAtTime(gain, ctx.currentTime + delay);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

const sounds: Record<Exclude<SoundId, "none">, () => void> = {
  chime: () => {
    playTone(880, 0.6, "sine", 0.2, 0);
    playTone(1174, 0.5, "sine", 0.15, 0.15);
    playTone(1318, 0.7, "sine", 0.12, 0.35);
  },
  bell: () => {
    playTone(830, 1.2, "sine", 0.3, 0);
    playTone(1245, 0.8, "sine", 0.1, 0.05);
    playTone(415, 1.5, "triangle", 0.15, 0);
  },
  digital: () => {
    playTone(1000, 0.15, "square", 0.15, 0);
    playTone(1000, 0.15, "square", 0.15, 0.25);
    playTone(1400, 0.3, "square", 0.15, 0.5);
  },
  gentle: () => {
    playTone(523, 0.8, "sine", 0.2, 0);
    playTone(659, 0.8, "sine", 0.15, 0.3);
    playTone(784, 1.0, "sine", 0.12, 0.6);
  },
  radar: () => {
    for (let i = 0; i < 3; i++) {
      playTone(1200, 0.2, "sine", 0.2, i * 0.35);
    }
    playTone(1600, 0.4, "sine", 0.25, 1.1);
  },
};

export function playSound(id: SoundId) {
  if (id === "none") return;
  try {
    sounds[id]();
  } catch {
    // Audio not available
  }
}

export function previewSound(id: SoundId) {
  playSound(id);
}
