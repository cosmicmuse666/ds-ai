export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          email: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          study_preferences: any | null;
          timezone: string | null;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          email: string;
          avatar_url?: string | null;
          study_preferences?: any | null;
          timezone?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          email?: string;
          avatar_url?: string | null;
          study_preferences?: any | null;
          timezone?: string | null;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          subject: string;
          planned_hours: number;
          actual_hours: number;
          completion_percentage: number;
          tasks: string[];
          notes: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          subject: string;
          planned_hours: number;
          actual_hours?: number;
          completion_percentage?: number;
          tasks: string[];
          notes?: any;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          subject?: string;
          planned_hours?: number;
          actual_hours?: number;
          completion_percentage?: number;
          tasks?: string[];
          notes?: any;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}