import { fontSize, lineHeight, radius, size, space } from "@/theme/tokens";
import { getTheme, type ThemeTokens } from "@/theme/themes";

export type TokenValue = string | number | undefined;

export type TokenKind = "space" | "size" | "radius" | "fontSize" | "lineHeight" | "color";

function normalizeKey(value: string): string {
  return value.startsWith("$") ? value : `$${value}`;
}

function lookupMap(map: Record<string, number>, raw: string): number | undefined {
  const key = normalizeKey(raw);
  const plain = raw.startsWith("$") ? raw.slice(1) : raw;
  return map[key] ?? map[plain] ?? map[`$${plain}`];
}

function lookupSpace(raw: string): number | undefined {
  const fromSpace = lookupMap(space as Record<string, number>, raw);
  if (fromSpace !== undefined) return fromSpace;
  // `$-2` → raw `-2`
  if (raw.startsWith("-")) {
    return (space as Record<string, number>)[raw] ?? (space as Record<string, number>)[`$${raw}`];
  }
  return undefined;
}

function lookupSize(raw: string): number | undefined {
  return lookupMap(size as Record<string, number>, raw);
}

function lookupRadius(raw: string): number | undefined {
  return lookupMap(radius as Record<string, number>, raw);
}

function lookupFontSize(raw: string): number | undefined {
  return lookupMap(fontSize as Record<string, number>, raw);
}

function lookupLineHeight(raw: string): number | undefined {
  return lookupMap(lineHeight as Record<string, number>, raw);
}

function resolveThemeColorKey(
  raw: string,
  theme: ThemeTokens,
  themeName: "light" | "dark"
): string | undefined {
  if (raw.endsWith("Light")) {
    const key = raw.slice(0, -5);
    return getTheme("light")[key];
  }
  if (raw.endsWith("Dark")) {
    const key = raw.slice(0, -4);
    return getTheme("dark")[key];
  }
  if (theme[raw] !== undefined) return theme[raw];
  return undefined;
}

export function resolveToken(
  value: TokenValue,
  theme: ThemeTokens,
  themeName: "light" | "dark" = "light",
  kind: TokenKind = "size"
): string | number | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string" || !value.startsWith("$")) return value;

  const raw = value.slice(1);

  if (kind === "color") {
    return resolveThemeColorKey(raw, theme, themeName) ?? value;
  }

  switch (kind) {
    case "space":
      return lookupSpace(raw);
    case "radius":
      return lookupRadius(raw);
    case "fontSize":
      return lookupFontSize(raw);
    case "lineHeight":
      return lookupLineHeight(raw) ?? lookupFontSize(raw);
    case "size":
    default:
      return lookupSize(raw);
  }
}

export function resolveColor(
  value: TokenValue,
  theme: ThemeTokens,
  themeName: "light" | "dark" = "light"
): string | undefined {
  const resolved = resolveToken(value, theme, themeName, "color");
  return typeof resolved === "string" ? resolved : undefined;
}

export function resolveNumber(
  value: TokenValue,
  theme: ThemeTokens,
  themeName: "light" | "dark" = "light",
  kind: TokenKind = "size"
): number | undefined {
  const resolved = resolveToken(value, theme, themeName, kind);
  return typeof resolved === "number" ? resolved : undefined;
}

/** Padding, margin, gap */
export function resolveSpace(
  value: TokenValue,
  theme: ThemeTokens,
  themeName: "light" | "dark" = "light"
) {
  return resolveNumber(value, theme, themeName, "space");
}

/** Width, height, icon dimensions */
export function resolveSize(
  value: TokenValue,
  theme: ThemeTokens,
  themeName: "light" | "dark" = "light"
) {
  return resolveNumber(value, theme, themeName, "size");
}

export function resolveRadius(
  value: TokenValue,
  theme: ThemeTokens,
  themeName: "light" | "dark" = "light"
) {
  return resolveNumber(value, theme, themeName, "radius");
}

export function resolveFontSize(
  value: TokenValue,
  theme: ThemeTokens,
  themeName: "light" | "dark" = "light"
) {
  return resolveNumber(value, theme, themeName, "fontSize");
}

export function resolveLineHeight(
  value: TokenValue,
  theme: ThemeTokens,
  themeName: "light" | "dark" = "light"
) {
  return resolveNumber(value, theme, themeName, "lineHeight");
}
