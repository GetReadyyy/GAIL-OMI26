window.GAIL_SUPABASE_CONFIG = {
  url: "https://xwmaafazjkazmyggajlg.supabase.co",
  anonKey: "sb_publishable_NeruDKBIVkZin9gGcYdphA_dEOIhJeO",
};

const { url, anonKey } = window.GAIL_SUPABASE_CONFIG;
window.gailSupabase =
  window.supabase && url && anonKey
    ? window.supabase.createClient(url, anonKey)
    : null;
