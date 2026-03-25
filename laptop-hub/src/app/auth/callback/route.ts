import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { AuthService } from '@/services/auth-service'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    await AuthService.exchangeCodeForSession(supabase, code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/`)
}
