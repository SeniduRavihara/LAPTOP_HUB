'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [userRole, setUserRole] = useState<'customer' | 'seller'>('customer')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Sign up as
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setUserRole('customer')}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
              userRole === 'customer'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-border/50'
            }`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setUserRole('seller')}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
              userRole === 'seller'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-border/50'
            }`}
          >
            Seller
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Full Name
        </label>
        <Input
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Email Address
        </label>
        <Input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
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
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Confirm Password
        </label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" className="mt-1 rounded border-border" required />
        <span className="text-sm text-muted-foreground">
          I agree to the{' '}
          <Link href="#" className="text-accent hover:text-accent/80">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-accent hover:text-accent/80">
            Privacy Policy
          </Link>
        </span>
      </label>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 rounded-lg font-medium transition-colors"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
     

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-accent hover:text-accent/80 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  )
}
