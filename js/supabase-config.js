/* Supabase configuration.
   The anon key is a public client key (safe to expose); data access is
   protected server-side by Row Level Security. */

const projectId = "evffhpojvwldwsvgnzxb";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZmZocG9qdndsZHdzdmduenhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzQwNTAsImV4cCI6MjA3NzUxMDA1MH0.t6MGNUnwZJC0TE9RYjQIviXWUfp_lIZtpXe3l1N-xi8";

// Our Supabase client instance is exposed as window.supabaseClient.
let supabaseClient = null;

function initSupabase() {
  if (window.supabaseClient) return window.supabaseClient;

  // The Supabase UMD build (loaded before this script) exposes a global `supabase`.
  const supabaseLib = window.supabase;

  if (supabaseLib && typeof supabaseLib.createClient === 'function') {
    try {
      supabaseClient = supabaseLib.createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );
      window.supabaseClient = supabaseClient;
      return supabaseClient;
    } catch (error) {
      console.error('Error creating Supabase client:', error);
    }
  }
  return null;
}

// The library script tag precedes this file, so it is normally available
// immediately. Fall back to a short retry only if the CDN is slow.
if (!initSupabase()) {
  let attempts = 0;
  const retry = setInterval(() => {
    if (initSupabase() || ++attempts > 40) { // ~2s max
      clearInterval(retry);
      if (!window.supabaseClient) {
        console.error('Supabase library failed to load.');
      }
    }
  }, 50);
}
