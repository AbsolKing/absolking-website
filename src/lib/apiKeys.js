/* ────────────────────────────────────────────────────────────
   apiKeys.js — public, read-only API keys for the browse pages.

   NOTE: these are embedded in the client bundle (unavoidable on a
   static site) and are visible in page source. That is acceptable
   here because both keys are READ-ONLY — they grant no write access
   to anything. The worst case is someone consuming the key's rate
   limit. Do not put any write-capable secret in this file.
   ──────────────────────────────────────────────────────────── */

export const RAWG_API_KEY = 'c223095b3ddc42a8beecb3c720b59f3e'

// TMDB v3 API key (used as ?api_key= query param).
export const TMDB_API_KEY = 'f099573e6b8082e13384149e841f6df8'
