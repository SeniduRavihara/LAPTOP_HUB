'use client'

import { createClient } from '@/lib/supabase/client'
import { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { AuthService } from '@/services/auth-service'
import { ProfileService } from '@/services/profile-service'

type AuthContextType = {
  user: User | null
  session: Session | null
  role: string | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const setData = async () => {
      try {
        const session = await AuthService.getSession(supabase)
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          const profile = await ProfileService.getUserProfile(supabase, session.user.id)
          setRole(profile?.role ?? 'customer')
        } else {
          setRole(null)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    const subscription = AuthService.onAuthStateChange(supabase, async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const profile = await ProfileService.getUserProfile(supabase, session.user.id)
        setRole(profile?.role ?? 'customer')
      } else {
        setRole(null)
      }
      
      setLoading(false)
    })

    setData()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signOut = async () => {
    try {
      await AuthService.signOut(supabase)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
