import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// A client specifically for public pages that does not read cookies.
// This allows Next.js to statically generate and use ISR (Incremental Static Regeneration).
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: {
        fetch: (url, options) => {
          return fetch(url, {
            ...options,
            next: { revalidate: 3600 } // Cache results for 1 hour by default
          })
        }
      }
    }
  )
}
