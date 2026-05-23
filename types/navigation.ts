import type { Href } from "expo-router";

export type SectionItemRoute =
  | "/reading"
  | "/multiple-choice"
  | "/fill-in-the-blank"
  | "/identify-the-chord-sheet";

const SECTION_ITEM_ROUTES: Record<string, SectionItemRoute> = {
  reading: "/reading",
  "multiple-choice": "/multiple-choice",
  "fill-in-the-blank": "/fill-in-the-blank",
  "identify-the-chord-sheet": "/identify-the-chord-sheet",
};

export function sectionItemRoute(type: string | null | undefined): SectionItemRoute | null {
  if (!type) return null;
  return SECTION_ITEM_ROUTES[type] ?? null;
}

export function dismissToHref(pathname: string, params: Record<string, string>): Href {
  return { pathname, params } as Href;
}
