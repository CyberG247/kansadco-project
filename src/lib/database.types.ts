export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; full_name: string; role: "admin" | "editor" | "viewer"; created_at: string; updated_at: string };
        Insert: { id: string; email: string; full_name?: string; role?: "admin" | "editor" | "viewer"; created_at?: string; updated_at?: string };
        Update: { email?: string; full_name?: string; role?: "admin" | "editor" | "viewer"; updated_at?: string };
        Relationships: [];
      };
      projects: {
        Row: { id: string; slug: string; name: string; type: string; location: string; progress: number; status: "Published" | "In progress" | "Draft"; year: string; description: string; image: string; client: string; scope: string; area: string; duration: string; overview: string; challenge: string; solution: string; features: string[]; gallery_images: string[]; updated_at: string; created_at: string };
        Insert: { id?: string; slug: string; name: string; type: string; location: string; progress?: number; status?: "Published" | "In progress" | "Draft"; year: string; description: string; image: string; client?: string; scope?: string; area?: string; duration?: string; overview?: string; challenge?: string; solution?: string; features?: string[]; gallery_images?: string[]; updated_at?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      gallery_assets: {
        Row: { id: string; src: string; name: string; type: string; location: string; year: string; status: "Published" | "Draft"; created_at: string; updated_at: string };
        Insert: { id?: string; src: string; name: string; type: string; location: string; year: string; status?: "Published" | "Draft"; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["gallery_assets"]["Insert"]>;
        Relationships: [];
      };
      team_members: {
        Row: { id: string; name: string; role: string; discipline: string; bio: string; image: string; email: string; featured: boolean; sort_order: number; status: "Published" | "Draft"; created_at: string; updated_at: string };
        Insert: { id?: string; name: string; role: string; discipline: string; bio?: string; image?: string; email: string; featured?: boolean; sort_order?: number; status?: "Published" | "Draft"; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
        Relationships: [];
      };
      enquiries: {
        Row: { id: string; name: string; email: string; phone: string; subject: string; message: string; status: "New" | "Review" | "Replied" | "Archived"; source: "Contact" | "Private tour" | "Admin"; notification_status: "Pending" | "Sent" | "Partial" | "Failed"; notification_message_id: string | null; acknowledgement_message_id: string | null; notification_error: string | null; notified_at: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; name: string; email: string; phone?: string; subject: string; message: string; status?: "New" | "Review" | "Replied" | "Archived"; source?: "Contact" | "Private tour" | "Admin"; notification_status?: "Pending" | "Sent" | "Partial" | "Failed"; notification_message_id?: string | null; acknowledgement_message_id?: string | null; notification_error?: string | null; notified_at?: string | null; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["enquiries"]["Insert"]>;
        Relationships: [];
      };
      enquiry_replies: {
        Row: { id: string; enquiry_id: string; admin_id: string | null; subject: string; message: string; delivery_status: "Pending" | "Sent" | "Failed"; brevo_message_id: string | null; delivery_error: string | null; sent_at: string | null; created_at: string };
        Insert: { id?: string; enquiry_id: string; admin_id?: string | null; subject: string; message: string; delivery_status?: "Pending" | "Sent" | "Failed"; brevo_message_id?: string | null; delivery_error?: string | null; sent_at?: string | null; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["enquiry_replies"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: { id: number; display_name: string; primary_email: string; telephone: string; abuja_address: string; kano_address: string; default_author: string; review_workflow: string; image_quality: string; content_initialized: boolean; updated_at: string };
        Insert: { id?: number; display_name: string; primary_email: string; telephone: string; abuja_address: string; kano_address: string; default_author: string; review_workflow: string; image_quality: string; content_initialized?: boolean; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
        Relationships: [];
      };
      activities: {
        Row: { id: string; message: string; type: "project" | "gallery" | "team" | "enquiry" | "settings"; read: boolean; created_at: string; actor_id: string | null };
        Insert: { id?: string; message: string; type: "project" | "gallery" | "team" | "enquiry" | "settings"; read?: boolean; created_at?: string; actor_id?: string | null };
        Update: { read?: boolean };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      claim_enquiry_submission: { Args: { p_fingerprint: string }; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
