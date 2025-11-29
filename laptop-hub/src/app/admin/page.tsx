'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (role !== 'admin' && role !== 'super_admin') {
        router.push('/')
      }
    }
  }, [user, role, loading, router])

  if (loading || !user || (role !== 'admin' && role !== 'super_admin')) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Welcome, {user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="rounded-lg border-4 border-dashed border-gray-200 p-10 text-center">
              <h2 className="text-2xl font-semibold text-gray-600">Admin Content Area</h2>
              <p className="mt-2 text-gray-500">This area is restricted to administrators only.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
