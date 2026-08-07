export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.2 (db9da0b)"
  }
  public: {
    Tables: {
      leaderboard: {
        Row: {
          created_at: string
          interval_training: number | null
          nashville_round_up: number | null
          pitch_perfect: number | null
          profile: string
          staff_master: number | null
        }
        Insert: {
          created_at?: string
          interval_training?: number | null
          nashville_round_up?: number | null
          pitch_perfect?: number | null
          profile: string
          staff_master?: number | null
        }
        Update: {
          created_at?: string
          interval_training?: number | null
          nashville_round_up?: number | null
          pitch_perfect?: number | null
          profile?: string
          staff_master?: number | null
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
          is_available: boolean
          poster: string | null
          poster_url: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          is_available?: boolean
          poster?: string | null
          poster_url?: string
          title?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          is_available?: boolean
          poster?: string | null
          poster_url?: string
          title?: string
        }
        Relationships: []
      }
      module_update: {
        Row: {
          created_at: string
          id: number
          version: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          version?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          version?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_days: Json[] | null
          avatar_url: string | null
          completed_modules: number[] | null
          completed_sections: Json[] | null
          expo_push_token: string | null
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
          expo_push_token?: string | null
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
          expo_push_token?: string | null
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
        Args: { completed_sections: Json }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      section_item_type: [
        "reading",
        "identify-the-chord-sheet",
        "fill-in-the-blank",
        "multiple-choice",
      ],
    },
  },
} as const
