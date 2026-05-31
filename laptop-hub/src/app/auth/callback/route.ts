import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { AuthService } from '@/services/auth-service'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    try {
      await AuthService.exchangeCodeForSession(code, supabase)
    } catch (error) {
      console.error('Auth callback code exchange failed:', error)
      return NextResponse.redirect(
        `${origin}/forgot-password?error=invalid_or_expired_link`
      )
    }

    // If there is a next parameter (like /reset-password), prioritize it
    if (next !== '/') {
      return NextResponse.redirect(`${origin}${next}`)
    }

    // Fetch profile to determine redirect for standard sign-ins
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        return NextResponse.redirect(`${origin}/admin/dashboard`)
      } else if (profile?.role === 'seller') {
        return NextResponse.redirect(`${origin}/seller/dashboard`)
      }
    }
  }

  // Fallback redirect
  return NextResponse.redirect(`${origin}${next}`)
}
