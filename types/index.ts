import { Database } from "./supabase";

export type SheetMusic = { clef: string; keys: string[]; duration: string }[];
export type SectionItem = Database["public"]["Tables"]["section_item"]["Row"] & {
  question_options: { id: number; option_text: string }[];
  sheet_music: SheetMusic;
};
export type Section = Database["public"]["Tables"]["section"]["Row"] & { section_item: SectionItem[]; completed?: boolean };
export type Module = Database["public"]["Tables"]["module"]["Row"] & { completed: boolean; progress: number, section: Section[], local_poster_uri: string };