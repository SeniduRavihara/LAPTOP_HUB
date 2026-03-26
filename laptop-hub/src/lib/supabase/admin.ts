import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin Client
 * WARNING: This client bypasses Row Level Security (RLS).
 * Only use this in Server Components, API routes, or Server Actions.
 * Never expose the SERVICE_ROLE_KEY to the client-side.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
