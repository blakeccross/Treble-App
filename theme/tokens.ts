// Layout and typography tokens (matches Tamagui config)

/** Component heights/widths (buttons, avatars, icons, etc.) */
export const size = {
  $0: 0,
  "$0.25": 2,
  "$0.5": 4,
  "$0.75": 8,
  $1: 20,
  "$1.5": 24,
  $2: 28,
  "$2.5": 32,
  $3: 36,
  "$3.5": 40,
  $4: 44,
  $true: 44,
  "$4.5": 48,
  $5: 52,
  $6: 64,
  $7: 74,
  $8: 84,
  $9: 94,
  $10: 104,
  $11: 124,
  $12: 144,
  $13: 164,
  $14: 184,
  $15: 204,
  $16: 224,
  $17: 224,
  $18: 244,
  $19: 264,
  $20: 284,
} as const;

function sizeToSpace(v: number) {
  if (v === 0) return 0;
  if (v === 2) return 0.5;
  if (v === 4) return 1;
  if (v === 8) return 1.5;
  if (v <= 16) return Math.round(v * 0.333);
  return Math.floor(v * 0.7 - 12);
}

const spaces = Object.entries(size).map(
  ([k, v]) => [k, sizeToSpace(v)] as const,
);
const spacesNegative = spaces.slice(1).flatMap(([k, v]) => {
  const suffix = k.slice(1);
  return [
    [`-${suffix}`, -v],
    [`$-${suffix}`, -v],
  ] as const;
});

/** Padding, margin, gap (derived from size scale — NOT the same numbers as size) */
export const space = {
  ...Object.fromEntries(spaces),
  ...Object.fromEntries(spacesNegative),
} as Record<string, number>;

/** Type scale: labels → body → section → hero (8px rhythm, Inter-first) */
export const fontSize = {
  $1: 12,
  $2: 13,
  $3: 14,
  $4: 15,
  $5: 16,
  $6: 17,
  $7: 18,
  $8: 22,
  $9: 28,
  $10: 34,
  $11: 40,
  $12: 48,
  $13: 56,
  $14: 64,
  $15: 72,
  $16: 80,
  true: 16,
} as const;

export const lineHeight = {
  $1: 16,
  $2: 18,
  $3: 20,
  $4: 22,
  $5: 24,
  $6: 24,
  $7: 26,
  $8: 28,
  $9: 34,
  $10: 40,
  $11: 48,
  $12: 56,
  $13: 64,
  $14: 72,
  $15: 80,
  $16: 88,
  true: 24,
} as const;

export const zIndex = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500,
} as const;

/** Corners: 12–28px family for Apple-like surfaces */
export const radius = {
  0: 0,
  1: 8,
  2: 10,
  3: 12,
  4: 14,
  true: 16,
  5: 18,
  6: 20,
  7: 22,
  8: 24,
  9: 28,
  10: 32,
  11: 40,
  12: 48,
} as const;
