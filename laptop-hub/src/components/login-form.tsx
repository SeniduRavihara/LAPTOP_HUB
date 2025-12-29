'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Email Address
        </label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded border-border" />
          <span className="text-sm text-muted-foreground">Remember me</span>
        </label>
        <Link href="/forgot-password" className="text-sm text-accent hover:text-accent/80 transition-colors">
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 rounded-lg font-medium transition-colors"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex items-center justify-center gap-2 border border-border bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.35 11.1h-9.16v2.92h5.46c-.23 1.44-1.41 3.72-5.46 3.72-3.29 0-5.97-2.71-5.97-6.05s2.68-6.05 5.97-6.05c1.87 0 3.13.8 3.85 1.48l2.62-2.52C17.4 2.3 15.06 1 12.19 1 6.81 1 2.5 5.34 2.5 10.7s4.31 9.7 9.69 9.7c5.58 0 9.06-3.9 9.06-9.3 0-.62-.07-1.08-.19-1.3z" fill="#4285F4"/>
          </svg>
          <span>Google</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex items-center justify-center gap-2 border border-border bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#1877F2" d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.09 5.66 21 10.44 21v-6.66H8.08V12h2.36V9.8c0-2.34 1.4-3.63 3.53-3.63 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.16 0-1.52.72-1.52 1.46V12h2.59l-.41 2.34h-2.18V21C18.34 21 22 17.09 22 12.07z"/>
          </svg>
          <span>Facebook</span>
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/signup" className="text-accent hover:text-accent/80 font-medium transition-colors">
          Sign up
        </Link>
      </p>
    </form>
  )
}
