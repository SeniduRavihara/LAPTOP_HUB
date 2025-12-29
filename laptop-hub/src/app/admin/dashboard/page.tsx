'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AdminSidebar } from '@/components/admin-sidebar'
import { StatCard } from '@/components/stat-card'
import { AlertBadge } from '@/components/alert-badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AdminDashboard() {
  const systemMetrics = [
    { id: 1, user: 'John Doe (Seller)', action: 'Listed new product', time: '5 mins ago', status: 'info' },
    { id: 2, user: 'Suspicious Account', action: 'Multiple failed login attempts', time: '15 mins ago', status: 'warning' },
    { id: 3, user: 'Sarah Johnson', action: 'Reported inappropriate content', time: '1 hour ago', status: 'alert' },
    { id: 4, user: 'Product XYZ', action: 'Flagged for review', time: '2 hours ago', status: 'alert' },
  ]

  const topSellers = [
    { id: 1, name: 'TechStore_Pro', sales: 342, revenue: '$245,680', status: 'Active', rating: 4.8 },
    { id: 2, name: 'ElectroMart', sales: 298, revenue: '$189,540', status: 'Active', rating: 4.6 },
    { id: 3, name: 'GadgetHub_Plus', sales: 256, revenue: '$156,320', status: 'Active', rating: 4.5 },
    { id: 4, name: 'TechDealers', sales: 187, revenue: '$98,450', status: 'Suspended', rating: 2.1 },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <AdminSidebar />

      {/* Header */}
      <div className="ml-64 border-b border-gray-200 bg-blue-100">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and system control.</p>
        </div>
      </div>

      {/* Content */}
      <div className="ml-64 p-8">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Users"
            value="12,584"
            change="+234 this week"
            gradient="bg-gradient-to-br from-blue-100 via-cyan-200 to-sky-300"
            icon={
              <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            }
          />
          <StatCard
            label="Active Sellers"
            value="1,247"
            change="+45 this month"
            gradient="bg-gradient-to-br from-violet-100 via-purple-200 to-indigo-300"
            icon={
              <svg className="w-6 h-6 text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            }
          />
          <StatCard
            label="Total Revenue"
            value="$2,845,320"
            change="+18.5% vs last month"
            gradient="bg-gradient-to-br from-emerald-100 via-green-200 to-teal-300"
            icon={
              <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            }
          />
          <StatCard
            label="Active Auctions"
            value="342"
            change="28 ending today"
            gradient="bg-gradient-to-br from-rose-100 via-pink-200 to-fuchsia-300"
            icon={
              <svg className="w-6 h-6 text-rose-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2zm4 2h2v14h-2z" />
              </svg>
            }
          />
        </div>

        {/* Alerts and System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AlertBadge count={3} label="Pending Reports" />
          <AlertBadge count={2} label="Suspended Sellers" />
          <AlertBadge count={7} label="Flagged Products" />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Activity */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">System Activity</h2>
                <Link href="/admin/reports" className="text-sm text-accent hover:text-accent/80 font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {systemMetrics.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-3 bg-secondary rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.status === 'info' ? 'bg-blue-500/10' :
                      item.status === 'warning' ? 'bg-yellow-500/10' :
                      'bg-red-500/10'
                    }`}>
                      <span className={`text-lg ${
                        item.status === 'info' ? 'text-blue-600' :
                        item.status === 'warning' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>!</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{item.user}</p>
                      <p className="text-xs text-muted-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                    </div>
                    {item.status !== 'info' && (
                      <Button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 h-8 text-xs rounded">
                        Review
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Sellers */}
          <div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Top Sellers</h2>
                <Link href="/admin/sellers" className="text-sm text-accent hover:text-accent/80 font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {topSellers.map((seller) => (
                  <div key={seller.id} className={`p-3 rounded-lg border ${
                    seller.status === 'Suspended' ? 'bg-red-500/5 border-red-500/20' : 'bg-secondary border-border'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">{seller.name}</p>
                        <p className={`text-xs font-semibold ${
                          seller.status === 'Suspended' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {seller.status}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-xs font-bold text-foreground">{seller.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{seller.sales} sales</span>
                      <span className="font-semibold text-foreground">{seller.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Admin Actions */}
            <div className="bg-card border border-border rounded-lg p-6 mt-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Admin Actions</h3>
              <div className="space-y-3 flex flex-col">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-10 font-medium">
                  Review Reports
                </Button>
                <Button variant="outline" className="w-full border border-border bg-background hover:bg-secondary rounded-lg h-10 font-medium">
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full border border-border bg-background hover:bg-secondary rounded-lg h-10 font-medium">
                  System Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </>
  )
}
