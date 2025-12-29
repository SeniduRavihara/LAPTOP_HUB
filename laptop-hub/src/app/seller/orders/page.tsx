'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SellerSidebar } from '@/components/seller-sidebar'
import { Button } from '@/components/ui/button'
import { useState } from 'react'


interface Order {
  id: string
  customerName: string
  productName: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  date: string
  shippingAddress: string
  estimatedDelivery: string
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    productName: 'Dell XPS 13 Laptop',
    amount: 999,
    status: 'delivered',
    date: '2025-11-10',
    shippingAddress: '123 Main St, New York, NY 10001',
    estimatedDelivery: '2025-11-15',
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    productName: 'HP Pavilion 15',
    amount: 649,
    status: 'shipped',
    date: '2025-11-16',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    estimatedDelivery: '2025-11-20',
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Johnson',
    productName: 'MacBook Air M2',
    amount: 1299,
    status: 'processing',
    date: '2025-11-17',
    shippingAddress: '789 Pine Rd, Chicago, IL 60601',
    estimatedDelivery: '2025-11-22',
  },
  {
    id: 'ORD-004',
    customerName: 'Sarah Williams',
    productName: 'Lenovo ThinkPad',
    amount: 849,
    status: 'pending',
    date: '2025-11-17',
    shippingAddress: '321 Elm St, Houston, TX 77001',
    estimatedDelivery: '2025-11-23',
  },
  {
    id: 'ORD-005',
    customerName: 'Robert Brown',
    productName: 'ASUS ROG Gaming Laptop',
    amount: 1599,
    status: 'shipped',
    date: '2025-11-15',
    shippingAddress: '654 Maple Dr, Phoenix, AZ 85001',
    estimatedDelivery: '2025-11-19',
  },
]

export default function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredOrders = mockOrders.filter(
    (order) => filterStatus === 'all' || order.status === filterStatus
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'processing':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )
      case 'shipped':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case 'delivered':
        return (
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your customer orders</p>
        </div>

        {/* Filter */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-4 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-card rounded-lg border border-border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-lg font-semibold text-foreground">{order.id}</p>
                    {getStatusIcon(order.status)}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Ordered on {order.date}</p>
                </div>
                <p className="text-2xl font-bold text-foreground">${order.amount}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Product</p>
                  <p className="font-medium text-foreground">{order.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                  <p className="font-medium text-foreground">{order.estimatedDelivery}</p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Shipping Address</p>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                  </div>
                </div>
              </div>

              <button className="w-full px-4 py-2 text-foreground bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors">
                View Order Details
              </button>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">No orders found.</p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Pending Orders</p>
            <p className="text-2xl font-bold text-amber-600">{mockOrders.filter((o) => o.status === 'pending').length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Processing</p>
            <p className="text-2xl font-bold text-blue-600">{mockOrders.filter((o) => o.status === 'processing').length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Shipped</p>
            <p className="text-2xl font-bold text-purple-600">{mockOrders.filter((o) => o.status === 'shipped').length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Delivered</p>
            <p className="text-2xl font-bold text-emerald-600">{mockOrders.filter((o) => o.status === 'delivered').length}</p>
          </div>
        </div>
      </main>
      </div>
      <Footer />
    </>
  )
}
