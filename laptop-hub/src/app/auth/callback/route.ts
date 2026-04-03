import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { AuthService } from '@/services/auth-service'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    await AuthService.exchangeCodeForSession(code, supabase)
    
    // Fetch profile to determine redirect
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
  return NextResponse.redirect(`${origin}/`)
}
