'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SellerSidebar } from '@/components/seller-sidebar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'inactive'
  image: string
  rating: number
  reviews: number
  sales: number
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Dell XPS 13 Laptop',
    price: 999,
    stock: 12,
    status: 'active',
    image: '/dell-xps-13-laptop.jpg',
    rating: 4.8,
    reviews: 234,
    sales: 156,
  },
  {
    id: '2',
    name: 'HP Pavilion 15',
    price: 649,
    stock: 8,
    status: 'active',
    image: '/hp-pavilion-laptop.jpg',
    rating: 4.5,
    reviews: 156,
    sales: 89,
  },
  {
    id: '3',
    name: 'MacBook Air M2',
    price: 1299,
    stock: 0,
    status: 'inactive',
    image: '/macbook-air-m2.png',
    rating: 4.9,
    reviews: 512,
    sales: 234,
  },
  {
    id: '4',
    name: 'Lenovo ThinkPad',
    price: 849,
    stock: 15,
    status: 'active',
    image: '/lenovo-thinkpad.png',
    rating: 4.6,
    reviews: 289,
    sales: 145,
  },
  {
    id: '5',
    name: 'ASUS ROG Gaming Laptop',
    price: 1599,
    stock: 5,
    status: 'draft',
    image: '/asus-rog-gaming-laptop.jpg',
    rating: 4.7,
    reviews: 178,
    sales: 92,
  },
  {
    id: '6',
    name: 'Microsoft Surface Laptop',
    price: 1199,
    stock: 10,
    status: 'active',
    image: '/microsoft-surface-laptop.jpg',
    rating: 4.4,
    reviews: 267,
    sales: 178,
  },
]

export default function MyProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800'
      case 'draft':
        return 'bg-amber-100 text-amber-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Products</h1>
            <p className="text-muted-foreground mt-1">Manage your product inventory and listings</p>
          </div>
          <Link href="/seller/products/new">
            <Button className="bg-primary hover:bg-primary/90">
              <span className="mr-2">+</span> Add New Product
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-4 mb-6 flex gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Sales</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium">${product.price}</td>
                  <td className="px-6 py-4">
                    <span className={product.stock > 5 ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-foreground font-medium">{product.rating}</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium">{product.sales}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="View">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Delete">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">No products found matching your filters.</p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Products</p>
            <p className="text-2xl font-bold text-foreground">{mockProducts.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Active Listings</p>
            <p className="text-2xl font-bold text-emerald-600">{mockProducts.filter((p) => p.status === 'active').length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Low Stock Items</p>
            <p className="text-2xl font-bold text-amber-600">{mockProducts.filter((p) => p.stock < 5 && p.stock > 0).length}</p>
          </div>
        </div>
        




        
      </main>
      </div>
      <Footer />
    </>
  )
}
