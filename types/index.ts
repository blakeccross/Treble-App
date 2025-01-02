import { Database } from "./supabase";

export type Profile = Omit<Database["public"]["Tables"]["profiles"]["Row"],"active_days"> & {active_days: string[], purchased_products?: string[]}
export type SheetMusic = {
  key: string;
  clef: "treble" | "bass" | "alto" | "percussion" | "";
  timeSig: string;
  notes: { clef: string; keys: string[]; duration: string }[];
}
export type SectionItem = Database["public"]["Tables"]["section_item"]["Row"] & {
  question_options: { id: number; option_text: string }[];
  sheet_music: SheetMusic;
  local_image_uri?: string;
};
export type Section = Database["public"]["Tables"]["section"]["Row"] & { section_item: SectionItem[]; completed?: boolean };
export type Module = Database["public"]["Tables"]["module"]["Row"] & { completed: boolean; progress: number, section: Section[], local_poster_uri: string };
export type Leaderboard = Database["public"]["Tables"]["leaderboard"]["Row"] & {profile: {full_name: string, avatar_url: string}}