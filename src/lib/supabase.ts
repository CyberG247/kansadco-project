import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Supabase environment variables are not configured.");
}

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const MEDIA_BUCKET = "site-media";
