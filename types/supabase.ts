export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      module: {
        Row: {
          created_at: string
          description: string
          id: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          title?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          title?: string
        }
        Relationships: []
      }
      section: {
        Row: {
          created_at: string
          id: number
          module: number | null
          premium: boolean
          sub_title: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          module?: number | null
          premium?: boolean
          sub_title?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          module?: number | null
          premium?: boolean
          sub_title?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "section_module_fkey"
            columns: ["module"]
            isOneToOne: false
            referencedRelation: "module"
            referencedColumns: ["id"]
          },
        ]
      }
      section_item: {
        Row: {
          answer_explanation: string | null
          answer_id: number | null
          created_at: string
          id: number
          question: string | null
          question_options: Json[] | null
          reading_text: string | null
          section: number | null
          sheet_music: Json | null
          type: Database["public"]["Enums"]["section_item_type"]
        }
        Insert: {
          answer_explanation?: string | null
          answer_id?: number | null
          created_at?: string
          id?: number
          question?: string | null
          question_options?: Json[] | null
          reading_text?: string | null
          section?: number | null
          sheet_music?: Json | null
          type: Database["public"]["Enums"]["section_item_type"]
        }
        Update: {
          answer_explanation?: string | null
          answer_id?: number | null
          created_at?: string
          id?: number
          question?: string | null
          question_options?: Json[] | null
          reading_text?: string | null
          section?: number | null
          sheet_music?: Json | null
          type?: Database["public"]["Enums"]["section_item_type"]
        }
        Relationships: [
          {
            foreignKeyName: "section_item_section_fkey"
            columns: ["section"]
            isOneToOne: false
            referencedRelation: "section"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      section_item_type:
        | "reading"
        | "identify-the-chord-sheet"
        | "fill-in-the-blank"
        | "multiple-choice"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
