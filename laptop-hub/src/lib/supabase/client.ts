"use client"

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Global fix for IPv6 connectivity issues in Node.js environments
if (typeof window === 'undefined') {
  try {
    const dns = require("node:dns");
    if (dns.setDefaultResultOrder) {
      dns.setDefaultResultOrder("ipv4first");
    }
  } catch (e) {
    // Ignore if not supported
  }
}

let browserClient: any;

/**
 * Standard Supabase Singleton
 * Matches patterns from SAMPLE projects.
 */
export function createClient() {
  if (typeof window === 'undefined') {
    return createBrowserClient(supabaseUrl, supabaseKey);
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    )
  }

  return browserClient
}

export const supabase = createClient();
