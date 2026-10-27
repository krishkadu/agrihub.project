/* ═══════════════════════════════════════════════
   AgriHub — Shared Supabase Client (Single Source of Truth)
   ═══════════════════════════════════════════════ */

const SUPABASE_URL  = 'https://lmcmpwpgyimeblaqrcfi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_vrQvxuwAzKHpYL-o2ZZDxQ_imQzcAuJ';

// Initialise once and expose globally so every page can reuse it
let supabaseClient = null;

(function () {
    try {
        if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.info('[AgriHub] Supabase connected ✅', SUPABASE_URL);
        } else {
            console.warn('[AgriHub] Supabase SDK not loaded — make sure the CDN script comes before supabase-client.js');
        }
    } catch (e) {
        console.error('[AgriHub] Supabase init failed:', e.message);
    }
})();
