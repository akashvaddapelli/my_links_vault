import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string) => {
    try {
        const parsed = new URL(url);
        return parsed.hostname !== "" && !url.includes("your_supabase");
    } catch {
        return false;
    }
};

const hasValidConfig =
    supabaseUrl &&
    supabaseAnonKey &&
    isValidUrl(supabaseUrl) &&
    supabaseAnonKey !== "your_supabase_anon_key";

if (!hasValidConfig) {
    console.error(
        "[LinkVault] Supabase is not configured.\n" +
        "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your:\n" +
        "  • .env file (for local dev)\n" +
        "  • Netlify Dashboard → Site configuration → Environment variables (for production)"
    );
}

// Only create the client if env vars are valid — otherwise export null.
// Hooks must check for null and throw a friendly error before making requests.
export const supabase: SupabaseClient | null = hasValidConfig
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = hasValidConfig;
