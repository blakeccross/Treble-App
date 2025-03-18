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
      leaderboard: {
        Row: {
          created_at: string
          interval_training: number | null
          nashville_round_up: number | null
          pitch_perfect: number | null
          profile: string
        }
        Insert: {
          created_at?: string
          interval_training?: number | null
          nashville_round_up?: number | null
          pitch_perfect?: number | null
          profile: string
        }
        Update: {
          created_at?: string
          interval_training?: number | null
          nashville_round_up?: number | null
          pitch_perfect?: number | null
          profile?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_profile_fkey"
            columns: ["profile"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module: {
        Row: {
          created_at: string
          description: string
          id: number
          poster_url: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          poster_url?: string
          title?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          poster_url?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_days: Json[] | null
          avatar_url: string | null
          completed_modules: number[] | null
          completed_sections: Json[] | null
          full_name: string | null
          id: string
          instrument: string | null
          total_xp: number
          updated_at: string | null
          xp_history: Json | null
        }
        Insert: {
          active_days?: Json[] | null
          avatar_url?: string | null
          completed_modules?: number[] | null
          completed_sections?: Json[] | null
          full_name?: string | null
          id: string
          instrument?: string | null
          total_xp?: number
          updated_at?: string | null
          xp_history?: Json | null
        }
        Update: {
          active_days?: Json[] | null
          avatar_url?: string | null
          completed_modules?: number[] | null
          completed_sections?: Json[] | null
          full_name?: string | null
          id?: string
          instrument?: string | null
          total_xp?: number
          updated_at?: string | null
          xp_history?: Json | null
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
          answer_id: number[] | null
          created_at: string
          id: number
          image: string | null
          question: string | null
          question_options: Json[] | null
          reading_text: string | null
          section: number | null
          sheet_music: Json | null
          type: Database["public"]["Enums"]["section_item_type"]
        }
        Insert: {
          answer_explanation?: string | null
          answer_id?: number[] | null
          created_at?: string
          id?: number
          image?: string | null
          question?: string | null
          question_options?: Json[] | null
          reading_text?: string | null
          section?: number | null
          sheet_music?: Json | null
          type: Database["public"]["Enums"]["section_item_type"]
        }
        Update: {
          answer_explanation?: string | null
          answer_id?: number[] | null
          created_at?: string
          id?: number
          image?: string | null
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
      validate_completed_sections: {
        Args: {
          completed_sections: Json
        }
        Returns: boolean
      }
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
