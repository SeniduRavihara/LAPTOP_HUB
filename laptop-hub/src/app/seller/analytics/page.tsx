'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SellerSidebar } from '@/components/seller-sidebar'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'


const salesData = [
  { month: 'Jan', sales: 2400, orders: 120 },
  { month: 'Feb', sales: 2210, orders: 135 },
  { month: 'Mar', sales: 2290, orders: 145 },
  { month: 'Apr', sales: 2000, orders: 98 },
  { month: 'May', sales: 2181, orders: 156 },
  { month: 'Jun', sales: 2500, orders: 178 },
  { month: 'Jul', sales: 2100, orders: 142 },
]

const productPerformance = [
  { name: 'Dell XPS 13', value: 35, revenue: 1560 },
  { name: 'HP Pavilion 15', value: 25, revenue: 899 },
  { name: 'MacBook Air M2', value: 20, revenue: 1299 },
  { name: 'Lenovo ThinkPad', value: 20, revenue: 849 },
]

const COLORS = ['#1e3a5f', '#3b82f6', '#60a5fa', '#bfdbfe']

export default function AnalyticsPage() {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+12.5%',
      isPositive: true,
      icon: 'dollar',
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      isPositive: true,
      icon: 'cart',
    },
    {
      title: 'Page Views',
      value: '45,230',
      change: '+5.1%',
      isPositive: true,
      icon: 'eye',
    },
    {
      title: 'Wishlist Adds',
      value: '892',
      change: '-2.3%',
      isPositive: false,
      icon: 'heart',
    },
  ]

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'dollar':
        return (
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'cart':
        return (
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      case 'eye':
        return (
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )
      case 'heart':
        return (
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <SellerSidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your store performance and metrics</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-card rounded-lg border border-border shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  {getIcon(metric.icon)}
                </div>
                <div className={`flex items-center gap-1 ${metric.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {metric.isPositive ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                  <span className="text-xs font-medium">{metric.change}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
              <p className="text-2xl font-bold text-foreground">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="col-span-2 bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Sales & Orders (Last 7 Months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Product Performance */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Top Products</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productPerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-2 gap-6">
          {/* Orders Over Time */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Orders Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Product Revenue */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Revenue by Product</h2>
            <div className="space-y-3">
              {productPerformance.map((product, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-sm font-semibold text-foreground">${product.revenue}</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${(product.revenue / 1560) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </main>
      </div>
      <Footer />
    </>
  )
}
