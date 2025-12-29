'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Download, CheckCircle } from 'lucide-react'

interface Product {
  id: string
  name: string
  seller: string
  status: 'Active' | 'Pending Review' | 'Flagged'
  stock: number
  price: string
  selected: boolean
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const [products, setProducts] = useState<Product[]>([
    {
      id: 'PRD-4511',
      name: 'Dell XPS 13 Plus',
      seller: 'TechStore_Pro',
      status: 'Active',
      stock: 42,
      price: '$1,299',
      selected: false
    },
    {
      id: 'PRD-4634',
      name: 'ASUS ROG Strix 15',
      seller: 'GamerWorld',
      status: 'Pending Review',
      stock: 15,
      price: '$1,599',
      selected: false
    },
    {
      id: 'PRD-4637',
      name: 'MacBook Air M2',
      seller: 'Apple Hub',
      status: 'Flagged',
      stock: 8,
      price: '$1,199',
      selected: false
    },
    {
      id: 'PRD-4701',
      name: 'Lenovo ThinkPad X1',
      seller: 'OfficePro',
      status: 'Active',
      stock: 22,
      price: '$1,049',
      selected: false
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Pending Review':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Flagged':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return ''
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || 
      product.status.toLowerCase().replace(' ', '-') === statusFilter

    return matchesSearch && matchesStatus
  })

  const selectedCount = products.filter(p => p.selected).length

  const handleSelectProduct = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, selected: !p.selected } : p
    ))
  }

  const handleSelectAll = () => {
    const allSelected = products.every(p => p.selected)
    setProducts(products.map(p => ({ ...p, selected: !allSelected })))
  }

  const handleApproveSelected = () => {
    console.log('Approving selected products:', products.filter(p => p.selected))
  }

  const handleExportCSV = () => {
    console.log('Exporting products to CSV')
  }

  const handleModerate = (productId: string) => {
    console.log('Moderating product:', productId)
  }

  const handleView = (productId: string) => {
    console.log('Viewing product:', productId)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <AdminSidebar />

      {/* Header */}
      <div className="ml-64 bg-white border-b">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">ADMIN</p>
              <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
              <p className="text-gray-600 mt-1">
                Review listings, enforce quality standards, and keep inventory in sync.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleExportCSV}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
                onClick={handleApproveSelected}
                disabled={selectedCount === 0}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Selected
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="ml-64 p-8">
        <div className="bg-white rounded-lg border">
          {/* Search and Filters */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by product, seller, or SKU"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status: All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending-review">Pending Review</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort: Recent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Sort: Recent</SelectItem>
                  <SelectItem value="oldest">Sort: Oldest</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="stock-high">Stock: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products List */}
          <div className="divide-y">
            {/* Header Row */}
            <div className="px-6 py-3 bg-gray-50 flex items-center gap-4">
              <Checkbox
                checked={products.length > 0 && products.every(p => p.selected)}
                onCheckedChange={handleSelectAll}
              />
              <div className="flex-1 text-sm font-medium text-gray-700">
                {selectedCount > 0 ? `${selectedCount} selected` : 'Product'}
              </div>
            </div>

            {/* Product Rows */}
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={product.selected}
                    onCheckedChange={() => handleSelectProduct(product.id)}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">{product.id}</p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">Seller: {product.seller}</p>
                      </div>

                      <div className="flex items-center gap-6">
                        <Badge className={`${getStatusColor(product.status)} font-medium px-3 py-1`}>
                          {product.status}
                        </Badge>

                        <div className="text-sm text-gray-700 min-w-[80px]">
                          <span className="font-medium">Stock</span> {product.stock}
                        </div>

                        <div className="text-sm text-gray-700 min-w-[90px]">
                          <span className="font-medium">Price</span> {product.price}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-700"
                            onClick={() => handleView(product.id)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
                            onClick={() => handleModerate(product.id)}
                          >
                            Moderate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products found matching your search criteria.
            </div>
          )}
        </div>
      </div>
      </main>
      <Footer/>
    </>
  )
}
