'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SellerSidebar } from '@/components/seller-sidebar'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'


export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'laptops',
    price: '',
    stock: '',
    processor: '',
    ram: '',
    storage: '',
    display: '',
    weight: '',
    warranty: '',
  })

  const [images, setImages] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Product submitted:', formData)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <SellerSidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/seller/products">
            <Button variant="outline" size="icon">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
            <p className="text-muted-foreground mt-1">Create a new product listing for your store</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Form */}
          <form onSubmit={handleSubmit} className="col-span-2">
            {/* Basic Information */}
            <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Dell XPS 13 Laptop"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="laptops">Laptops</option>
                    <option value="desktops">Desktops</option>
                    <option value="accessories">Accessories</option>
                    <option value="peripherals">Peripherals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your product in detail..."
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Pricing and Stock */}
            <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Pricing & Stock</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="999.99"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="10"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Specifications</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Processor</label>
                    <input
                      type="text"
                      name="processor"
                      value={formData.processor}
                      onChange={handleInputChange}
                      placeholder="Intel Core i7"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">RAM</label>
                    <input
                      type="text"
                      name="ram"
                      value={formData.ram}
                      onChange={handleInputChange}
                      placeholder="16GB DDR4"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Storage</label>
                    <input
                      type="text"
                      name="storage"
                      value={formData.storage}
                      onChange={handleInputChange}
                      placeholder="512GB SSD"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Display</label>
                    <input
                      type="text"
                      name="display"
                      value={formData.display}
                      onChange={handleInputChange}
                      placeholder="13.3 inch FHD"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="1.2 kg"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Warranty</label>
                    <input
                      type="text"
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      placeholder="2 years"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4">
              <Link href="/seller/products" className="flex-1">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Publish Product
              </button>
            </div>
          </form>

          {/* Sidebar */}
          <div>
            {/* Image Upload */}
            <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Product Images</h2>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20">
                <svg className="w-8 h-8 text-muted-foreground mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <p className="text-sm font-medium text-foreground mb-1">Drop images here or click to upload</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB each</p>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Tips for Better Listings</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <li>• Use clear, descriptive product names</li>
                <li>• Include detailed specifications</li>
                <li>• Add high-quality product images</li>
                <li>• Set competitive pricing</li>
                <li>• Provide accurate stock information</li>
              </ul>
            </div>
          </div>
        </div>
       
       
      </main>
      </div>
       <Footer />
    </>
  )
}
