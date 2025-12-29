'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SellerSidebar } from '@/components/seller-sidebar'
import { StatCard } from '@/components/stat-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SellerDashboard() {
  const recentOrders = [
    { id: 'ORD001', product: 'Dell XPS 13', customer: 'John Doe', total: '$1,299', status: 'Delivered', date: '2 hours ago' },
    { id: 'ORD002', product: 'MacBook Air M2', customer: 'Jane Smith', total: '$1,199', status: 'Shipped', date: '5 hours ago' },
    { id: 'ORD003', product: 'Lenovo ThinkPad', customer: 'Bob Wilson', total: '$699', status: 'Processing', date: '1 day ago' },
    { id: 'ORD004', product: 'HP Pavilion', customer: 'Alice Brown', total: '$549', status: 'Pending', date: '2 days ago' },
  ]

  const topProducts = [
    { id: 1, name: 'Dell XPS 13 Plus', sales: 42, revenue: '$54,558', trend: '+12%' },
    { id: 2, name: 'MacBook Air M2', sales: 28, revenue: '$33,572', trend: '+8%' },
    { id: 3, name: 'Lenovo ThinkPad E14', sales: 19, revenue: '$13,281', trend: '+5%' },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <SellerSidebar />

      {/* Header */}
      <div className="ml-64 border-b border-gray-200 bg-blue-100">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your sales overview.</p>
        </div>
      </div>

      {/* Content */}
      <div className="ml-64 p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Sales"
            value="$124,568"
            change="+12.5% vs last month"
            gradient="bg-gradient-to-br from-green-100 via-emerald-200 to-teal-300"
            icon={
              <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            }
          />
          <StatCard
            label="Orders"
            value="234"
            change="+8 orders today"
            gradient="bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-300"
            icon={
              <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12h-4v4h-4v-4H4v-2h4V8h4v4h4v2z" />
              </svg>
            }
          />
          <StatCard
            label="Products"
            value="48"
            change="5 new this week"
            gradient="bg-gradient-to-br from-purple-100 via-violet-200 to-fuchsia-300"
            icon={
              <svg className="w-6 h-6 text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zm-5.04-6.71l-2.75 3.54-2.16-2.66c-.6-.73-1.73-.73-2.33 0-.6.73-.6 1.93 0 2.66l3 3.87c.6.73 1.73.73 2.33 0l4.08-5.23c.6-.73.6-1.93 0-2.66-.6-.73-1.73-.73-2.33 0z" />
              </svg>
            }
          />
          <StatCard
            label="Customer Rating"
            value="4.8"
            change="Based on 328 reviews"
            gradient="bg-gradient-to-br from-amber-100 via-yellow-200 to-orange-300"
            icon={
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            }
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
                <Link href="/seller/orders" className="text-sm text-accent hover:text-accent/80 font-medium">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Order ID</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Product</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Customer</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">{order.id}</td>
                        <td className="py-3 px-4 text-foreground">{order.product}</td>
                        <td className="py-3 px-4 text-muted-foreground">{order.customer}</td>
                        <td className="py-3 px-4 font-semibold text-foreground">{order.total}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'Delivered' ? 'bg-green-500/10 text-green-700' :
                            order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-700' :
                            order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-700' :
                            'bg-gray-500/10 text-gray-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Top Products</h2>
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div key={product.id} className="pb-4 border-b border-border last:border-0">
                    <p className="font-medium text-foreground text-sm">{product.name}</p>
                    <div className="flex items-end justify-between gap-2 mt-2">
                      <div>
                        <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                        <p className="text-sm font-semibold text-foreground">{product.revenue}</p>
                      </div>
                      <p className="text-xs font-bold text-green-600">{product.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6 mt-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3 flex flex-col">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-10 font-medium">
                  Add New Product
                </Button>
                <Button variant="outline" className="w-full border border-border bg-background hover:bg-secondary rounded-lg h-10 font-medium">
                  Create Auction
                </Button>
                <Button variant="outline" className="w-full border border-border bg-background hover:bg-secondary rounded-lg h-10 font-medium">
                  View Messages
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      </main>
    </>
  )
}
