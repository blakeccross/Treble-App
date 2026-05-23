import type { PianoKey } from "./pianoKeys";

/** Normalize lowercase note names (e.g. from interval training) to PianoKey format. */
export function toPianoKey(note: string): PianoKey {
  const normalized = note.replace(/^([a-g])([#b]?)(\d)$/i, (_, letter, acc, octave) => {
    const base = letter.toUpperCase();
    return `${base}${acc ?? ""}${octave}`;
  });
  return normalized as PianoKey;
}
