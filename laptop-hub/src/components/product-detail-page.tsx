'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ProductDetailPage() {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specification' | 'reviews' | 'delivery'>('description')

  const product = {
    id: 'product-detail-1', // Unique ID for cart functionality
    name: 'Dell XPS 13 Plus Laptop - 13.4" FHD Display',
    brand: 'Dell',
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 328,
    inStock: true,
    seller: 'TechStore_Pro',
    sellerRating: 4.8,
    description: 'Premium ultrabook with Intel Core i7, 16GB RAM, and lightning-fast 512GB SSD. Perfect for professionals and creative work.',
    specs: [
      { label: 'Display', value: '13.4" FHD (1920x1200)' },
      { label: 'Processor', value: 'Intel Core i7-1280P' },
      { label: 'RAM', value: '16GB LPDDR5' },
      { label: 'Storage', value: '512GB NVMe SSD' },
      { label: 'Graphics', value: 'Intel Iris Xe' },
      { label: 'Battery', value: 'Up to 12 hours' },
      { label: 'Weight', value: '2.8 lbs' },
      { label: 'OS', value: 'Windows 11 Pro' },
    ],
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    ],
  }

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id)
    
    if (existingItemIndex > -1) {
      // Update quantity if product exists
      existingCart[existingItemIndex].quantity += quantity
    } else {
      // Add new product to cart
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0],
      })
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart))
    
    // Navigate to cart page
    router.push('/cart')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Images */}
        <div className="lg:col-span-2">
          <div className="bg-secondary border border-border rounded-lg overflow-hidden mb-4">
            <div className="relative w-full h-[400px]">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-full h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === idx ? 'border-primary' : 'border-border hover:border-border/50'
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`View ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-3">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-2">{product.brand}</p>
            <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-4xl font-bold text-primary">${product.price}</span>
                <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                <span className="text-lg font-bold text-green-600">{Math.round((1 - product.price / product.originalPrice) * 100)}% off</span>
              </div>
              <p className="text-sm text-muted-foreground">Free shipping on orders over $50</p>
            </div>

            {/* Warranty & Payment Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Warranty Badge */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white transform rotate-3 hover:rotate-0 transition-transform">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 0l2.5 7.5h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="text-5xl font-bold mb-1">2</div>
                      <div className="text-xs font-semibold uppercase tracking-wider">Year</div>
                      <div className="text-sm font-bold uppercase tracking-wide mt-1">Warranty</div>
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-red-800 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                          WARRANTY
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment & Details */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">2 YEAR WARRANTY</h3>
                  <div className="flex items-center gap-3 mb-4">
                    {/* Visa Card */}
                    <div className="bg-white px-5 py-3 rounded-lg shadow-md border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-lg">
                      <svg className="h-8 w-16" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="32" rx="3" fill="white"/>
                        <path d="M19.5 19l1.8-11h2.9l-1.8 11h-2.9zm13.5-10.7c-.6-.2-1.5-.4-2.6-.4-2.9 0-4.9 1.5-4.9 3.6 0 1.6 1.4 2.4 2.5 3 1.1.5 1.5.9 1.5 1.4 0 .7-.9 1.1-1.7 1.1-1.1 0-1.7-.2-2.7-.6l-.4-.2-.4 2.4c.7.3 2 .6 3.3.6 3.1 0 5.1-1.5 5.1-3.8 0-1.2-.7-2.2-2.4-2.9-1-.5-1.6-.8-1.6-1.3 0-.5.5-.9 1.7-.9.9 0 1.6.2 2.1.4l.3.1.4-2.5zm5.7-2.3h-2.2c-.7 0-1.2.2-1.5.9l-4.2 10h3.1s.5-1.4.6-1.7h3.7c.1.3.4 1.7.4 1.7h2.7l-2.6-11zm-3.6 7.1c.2-.6 1.2-3.2 1.2-3.2l.7 3.2h-1.9zm-14.8-7.1l-2.8 7.5-.3-1.5c-.5-1.7-2.1-3.6-3.9-4.5l2.6 9.5h3.1l4.6-11h-3.3z" fill="#1A1F71"/>
                        <path d="M11.5 8h-4.7l-.1.3c3.7.9 6.1 3.1 7.1 5.8l-1-5.2c-.2-.7-.7-.9-1.3-.9z" fill="#F7B600"/>
                      </svg>
                    </div>
                    
                    {/* Mastercard */}
                    <div className="bg-white px-5 py-3 rounded-lg shadow-md border-2 border-gray-200 hover:border-orange-400 transition-all hover:shadow-lg">
                      <svg className="h-8 w-16" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="32" rx="3" fill="white"/>
                        <circle cx="18" cy="16" r="9" fill="#EB001B"/>
                        <circle cx="30" cy="16" r="9" fill="#F79E1B"/>
                        <path d="M24 9a9 9 0 000 14 9 9 0 000-14z" fill="#FF5F00"/>
                      </svg>
                    </div>
                    
                    {/* American Express */}
                    <div className="bg-white px-5 py-3 rounded-lg shadow-md border-2 border-gray-200 hover:border-blue-600 transition-all hover:shadow-lg">
                      <svg className="h-8 w-16" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="32" rx="3" fill="white"/>
                        <rect x="4" y="8" width="40" height="16" rx="1" fill="#006FCF"/>
                        <path d="M10 18l1.2-2.8h1.6l-2 4.6h-1.6l-2-4.6h1.6L10 18zm6.4-2.8h-2.8l-.3.7h2.8l.3-.7zm-.7 1.6h-2.8l-.3.7h2.8l.3-.7zm-.7 1.6h-2.8l-.4.8h3.6l.4-.8h-1l.2-.8zm3.8-1.2v-.4c0-.5.3-.8.8-.8h2.2l.3-.7h-2.7c-1 0-1.6.6-1.6 1.5v.4c0 .9.6 1.5 1.6 1.5h1.8l.3-.7h-2c-.4 0-.7-.3-.7-.8zm6.7 1.6l.7-1.6h1.4l-.9 2.3c-.3.7-.7 1.1-1.4 1.1h-1l.3-.7h.7c.3 0 .4-.1.5-.3l.1-.2h-.9l-1.4-3.2h1.6l.7 1.6.6-1.6h1.6l-1.6 3.3zm7.8 0c-.4 0-.6-.2-.6-.6v-1.4h1.2l.3-.7h-1.5v-1h-1.4v1h-.7l-.3.7h1v1.4c0 1 .5 1.4 1.4 1.4h1.3l.3-.7h-1zm4.7 0c-.4 0-.6-.2-.6-.6v-1.4h1.2l.3-.7h-1.5v-1h-1.4v1h-.7l-.3.7h1v1.4c0 1 .5 1.4 1.4 1.4h1.3l.3-.7h-1z" fill="white" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">* Other accessories cost may apply</p>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-secondary border border-border rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Sold by</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{product.seller}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.sellerRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{product.sellerRating}</span>
                  </div>
                </div>
                <Button variant="outline" className="border border-border">
                  View Store
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <p className={`text-sm font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? '✓ In Stock' : 'Out of Stock'}
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Quantity</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-l border-r border-border text-foreground font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </Button>

              <Button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-full h-12 rounded-lg font-semibold text-lg transition-colors ${
                  isWishlisted
                    ? 'bg-red-500/10 text-red-600 border border-red-500'
                    : 'bg-secondary hover:bg-secondary/80 border border-border text-foreground'
                }`}
              >
                {isWishlisted ? '♥ Added to Wishlist' : '☆ Add to Wishlist'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description with Images - Full Width */}
      <div className="mt-12 space-y-12">
        {/* Description Section 1 */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">Dell XPS 13 Plus is powered by the Intel Core i7</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-4xl mx-auto">
            The powerful Intel Core i7-1280P processor, which features 14 cores and 20 threads, provides unmatched performance with a lightning-fast 4.8GHz, with a premium design featuring an Evo-Certified build.
          </p>
          <div className="bg-gray-100 rounded-lg p-12 w-full">
            <div className="relative w-full h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80"
                alt="Dell XPS 13 Front View"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Storage & Connectivity */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">Storage & Connectivity</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-4xl mx-auto">
            Equipped with a 512GB M.2 2242 NVMe PCIe 4.0x4 SSD, the laptop offers 5 seconds fast boot times and plenty of room to store. The laptop supports up to two 4K 60Hz displays or one 8K 30Hz display for future storage expansion.
          </p>
          <div className="bg-gray-100 rounded-lg p-12 w-full">
            <div className="relative w-full h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80"
                alt="Dell XPS 13 Angle View"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Display & Design */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">Display & Design</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-4xl mx-auto">
            Experience a 13.4" FHD (1920 x 1200) WUXGA LCD display. The panel supports up to 500 nits brightness and features a fully-flat, allowing for future storage expansion.
          </p>
          <div className="bg-gray-100 rounded-lg p-12 w-full">
            <div className="relative w-full h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"
                alt="Dell XPS 13 Closed View"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Section */}
      <div className="mt-12">
        <div className="border-b border-border">
                <div className="flex gap-8">
                  <button 
                    onClick={() => setActiveTab('description')}
                    className={`pb-3 px-1 border-b-2 ${activeTab === 'description' ? 'border-primary text-primary font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    Description
                  </button>
                  <button 
                    onClick={() => setActiveTab('specification')}
                    className={`pb-3 px-1 border-b-2 ${activeTab === 'specification' ? 'border-primary text-primary font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    Specification
                  </button>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-3 px-1 border-b-2 ${activeTab === 'reviews' ? 'border-primary text-primary font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    Reviews
                  </button>
                  <button 
                    onClick={() => setActiveTab('delivery')}
                    className={`pb-3 px-1 border-b-2 ${activeTab === 'delivery' ? 'border-primary text-primary font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    Delivery Information
                  </button>
                </div>
              </div>

              {/* Description Tab Content */}
              {activeTab === 'description' && (
                <div className="py-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Product Overview</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      The Dell XPS 13 Plus is a premium ultrabook that combines cutting-edge performance with an ultra-slim design. 
                      Powered by the 12th Gen Intel Core i7-1280P processor with 14 cores and 20 threads, this laptop delivers 
                      exceptional performance for multitasking, content creation, and demanding applications.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Key Features</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Stunning 13.4" FHD+ display with up to 500 nits brightness</li>
                      <li>• 16GB LPDDR5 RAM for seamless multitasking</li>
                      <li>• 512GB PCIe NVMe SSD for ultra-fast storage</li>
                      <li>• Intel Iris Xe Graphics for enhanced visual performance</li>
                      <li>• Premium build quality with modern, minimalist design</li>
                      <li>• Long battery life for all-day productivity</li>
                      <li>• Advanced cooling system for sustained performance</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Perfect For</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Business professionals, content creators, students, and anyone who needs a powerful, portable laptop 
                      for work and entertainment. The Dell XPS 13 Plus excels at productivity tasks, video conferencing, 
                      photo editing, and light video editing.
                    </p>
                  </div>
                </div>
              )}

              {/* Specification Tab Content */}
              {activeTab === 'specification' && (
                <div className="py-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-foreground mb-1">Processor</p>
                    <p className="text-muted-foreground">Intel Core i7-1280P 14C (6P + 8E) / 20T, P-core 1.3 / 4.8GHz, E-core 0.9 / 3.6GHz, 24MB</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Display</p>
                    <p className="text-muted-foreground">13.4" FHD+ Platform</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Storage</p>
                    <p className="text-muted-foreground">512GB M.2 2242 PCIe 4.0x4 NVMe SSD</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Memory</p>
                    <p className="text-muted-foreground">16GB LPDDR5-4800 (Soldered DDR5-4800)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">RAM</p>
                    <p className="text-muted-foreground">16 GB (8GB Soldered) LPDDR5-6400 Dual-channel (16-20-20-45)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Graphics</p>
                    <p className="text-muted-foreground">Integrated Intel Iris Xe Graphics</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Touchscreen</p>
                    <p className="text-muted-foreground">No</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Keyboard</p>
                    <p className="text-muted-foreground">Non-backlit, English (EU)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Touchpad</p>
                    <p className="text-muted-foreground">Buttonless Mylar surface with multi-touch, supports Precision TouchPad (PTP), FPR = 19x 100 mm (7.5 x 3.94 inches)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Microphone</p>
                    <p className="text-muted-foreground">2x, Array</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Speaker</p>
                    <p className="text-muted-foreground">Stereo Speakers, Integrated Smart Amp</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Camera</p>
                    <p className="text-muted-foreground">FHD 1080p with Privacy Shutter</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Integrated Screen</p>
                    <p className="text-muted-foreground">No</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Power Adapter</p>
                    <p className="text-muted-foreground">65W USB-C (Type C) adapter with Dolby Audio</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Dimensions (WxDxH)</p>
                    <p className="text-muted-foreground">295.4 x 215 x 16.9 mm (11.63 x 8.46 x 0.67 inches)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Ethernet</p>
                    <p className="text-muted-foreground">No Ethernet Port</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Wireless</p>
                    <p className="text-muted-foreground">Wi-Fi 6E AX211, 802.11ax 2x2</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Bluetooth</p>
                    <p className="text-muted-foreground">Bluetooth 5.3</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Security Chip</p>
                    <p className="text-muted-foreground">Firmware TPM 2.0 Enabled</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Other Capabilities</p>
                    <p className="text-muted-foreground">IR camera for Windows Hello; facial recognition/Light Sensonlight Security Solution)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Weight</p>
                    <p className="text-muted-foreground">Starting at 1.24 kg (2.73 lbs)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Color</p>
                    <p className="text-muted-foreground">Storm Gray</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-semibold text-foreground mb-1">SECURITY & PRIVACY</p>
                    <p className="text-muted-foreground">Firmware TPM 2.0 Enabled</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-semibold text-foreground mb-1">Other Capabilities</p>
                    <p className="text-muted-foreground">IR camera for Windows Hello; facial recognition/Light Sensor</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-semibold text-foreground mb-1">CERTIFICATIONS</p>
                    <p className="text-muted-foreground">Green Certifications</p>
                    <p className="text-muted-foreground">• EPEAT GOLD</p>
                    <p className="text-muted-foreground">• RoHS Compliant</p>
                    <p className="text-muted-foreground">Other Certifications</p>
                    <p className="text-muted-foreground">• TÜV Rheinland Low Blue Light (Software Solution)</p>
                  </div>
                </div>
              </div>
              )}

              {/* Reviews Tab Content */}
              {activeTab === 'reviews' && (
                <div className="py-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
                  <div className="space-y-6">
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="pb-6 border-b border-border last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-foreground">John Doe</p>
                            <div className="flex gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-4 h-4 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">2 days ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Excellent laptop! Very fast, sleek design, and great battery life. Highly recommend for professionals.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Information Tab Content */}
              {activeTab === 'delivery' && (
                <div className="py-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Delivery Information</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-secondary border border-border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          <h3 className="text-lg font-bold text-foreground">Standard Shipping</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Cost: <span className="font-semibold text-green-600">Free</span></p>
                          <p className="text-sm text-muted-foreground">Estimated Delivery: <span className="font-semibold text-foreground">5-7 business days</span></p>
                          <p className="text-xs text-muted-foreground mt-3">Free shipping on all orders over $50. Track your package online.</p>
                        </div>
                      </div>

                      <div className="bg-secondary border border-border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <h3 className="text-lg font-bold text-foreground">Express Shipping</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Cost: <span className="font-semibold text-foreground">$19.99</span></p>
                          <p className="text-sm text-muted-foreground">Estimated Delivery: <span className="font-semibold text-foreground">2-3 business days</span></p>
                          <p className="text-xs text-muted-foreground mt-3">Get your order faster with priority processing and shipping.</p>
                        </div>
                      </div>

                      <div className="bg-secondary border border-border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <h3 className="text-lg font-bold text-foreground">International Shipping</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Cost: <span className="font-semibold text-foreground">Calculated at checkout</span></p>
                          <p className="text-sm text-muted-foreground">Estimated Delivery: <span className="font-semibold text-foreground">7-14 business days</span></p>
                          <p className="text-xs text-muted-foreground mt-3">We ship worldwide. Customs fees may apply.</p>
                        </div>
                      </div>

                      <div className="bg-secondary border border-border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <h3 className="text-lg font-bold text-foreground">Warranty & Returns</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Manufacturer Warranty: <span className="font-semibold text-foreground">2 years included</span></p>
                          <p className="text-sm text-muted-foreground">Return Period: <span className="font-semibold text-foreground">30 days</span></p>
                          <p className="text-xs text-muted-foreground mt-3">Free returns within 30 days. Product must be in original condition.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Important Shipping Information
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• All orders are processed within 1-2 business days</li>
                        <li>• You will receive a tracking number once your order ships</li>
                        <li>• Signature may be required for high-value items</li>
                        <li>• PO Boxes are accepted for standard shipping only</li>
                        <li>• Business days exclude weekends and holidays</li>
                        <li>• Delivery times may vary during peak seasons</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
          </div>
    </div>
  )
}
