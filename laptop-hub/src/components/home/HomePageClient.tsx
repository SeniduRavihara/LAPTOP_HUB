'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product-card'
import { AuctionCard } from '@/components/auction-card'
import { ProductFilters } from '@/components/product-filters'
import { toast } from 'sonner'

interface HomePageClientProps {
  products: any[];
  auctions: any[];
  wishlistedProductIds?: string[];
}

export default function HomePageClient({ products = [], auctions = [], wishlistedProductIds = [] }: HomePageClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeFilter, setActiveFilter] = useState<'all' | 'premium' | 'gaming'>('all')
  const totalSlides = 4

  const handleFilter = (filter: 'premium' | 'gaming') => {
    setActiveFilter(filter)
    const productsSection = document.getElementById('products')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Quick filter for the displayed recent products
  const filteredProducts = products.filter(product => {
    // Exclude auction products from the standard recent products section
    const auction = Array.isArray(product.auctions) ? product.auctions[0] : product.auctions;
    const isAuction = auction && (auction.status === 'active' || auction.status === 'pending');
    if (isAuction) return false;

    if (activeFilter === 'premium') return product.price >= 100000 // assuming LKR, premium > 100k
    if (activeFilter === 'gaming') return product.name?.toLowerCase().includes('gaming') || product.brand?.toLowerCase() === 'msi' || product.brand?.toLowerCase() === 'asus'
    return true
  })

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Video/Image Background */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/asus-rog-gaming-laptop.jpg')" }}
        ></div>

        {/* Overlay to darken video */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Powerful & Sleek<br />Laptops
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Find the perfect laptop<br />for education, gaming, and more!
              </p>
              <Link
                href="#products"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Shop Now
              </Link>
              <p className="text-sm text-white/80 mt-4">
                Limited Time Offers • Free Shipping
              </p>
            </div>

            {/* Laptop Images on the right */}
            <div className="hidden md:flex flex-col gap-4">
              <div
                onClick={() => handleFilter('premium')}
                className="relative w-[280px] h-[180px] rounded-xl border border-white/20 shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: "url('/macbook-air-m2.png')" }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-semibold"> Our Premium Collection</p>
                  <p className="text-xs text-white/70">Flagship Devices</p>
                </div>
              </div>
              <div
                onClick={() => handleFilter('gaming')}
                className="relative w-[280px] h-[180px] rounded-xl border border-white/20 shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: "url('/msi-gaming-laptop.jpg')" }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-semibold"> Our Gaming Series</p>
                  <p className="text-xs text-white/70">High Performance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Badges at Bottom */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-12 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-semibold hidden sm:inline">Top Brands</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold hidden sm:inline">Best Deals</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-semibold hidden sm:inline">Fast Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions Section */}
      {auctions && auctions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-bold text-foreground tracking-tight">Featured Auctions</h2>
              <p className="text-muted-foreground mt-2">Ending soon! Grab your dream laptop at your price.</p>
            </div>
            <Link href="/auctions" className="text-primary hover:underline font-bold flex items-center justify-center gap-1 group">
              View All Auctions
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {auctions.map((auction: any) => {
              const product = auction.products || {};
              const currentBid = auction.bids?.reduce((max: number, b: any) => Math.max(max, b.amount), 0) || auction.starting_bid;
              
              return (
                <AuctionCard 
                  key={auction.id}
                  id={auction.id}
                  productId={product.id}
                  name={product.name || 'Unknown Laptop'}
                  brand={product.brand}
                  image={product.images?.[0]}
                  currentBid={currentBid}
                  numberOfBids={auction.bids?.length || 0}
                  endTime={auction.end_time}
                  rating={4.8}
                  seller="Verified Seller"
                  initialIsWatching={wishlistedProductIds.includes(product.id)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Advertisement Banner Section */}
      <section className="w-full bg-background pb-10 border-b border-border">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-muted">
            {/* Banner Carousel */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Slide 1 */}
              <div className="min-w-full relative h-[300px] md:h-[400px]">
                <img src="/slider/slide1.jpeg" alt="Banner 1" className="w-full h-full object-contain" />
              </div>

              {/* Slide 2 */}
              <div className="min-w-full relative h-[300px] md:h-[400px]">
                <img src="/slider/slide2.jpeg" alt="Banner 2" className="w-full h-full object-contain" />
              </div>

              {/* Slide 3 */}
              <div className="min-w-full relative h-[300px] md:h-[400px]">
                <img src="/slider/slide3.jpeg" alt="Banner 3" className="w-full h-full object-contain" />
              </div>

              {/* Slide 4 */}
              <div className="min-w-full relative h-[300px] md:h-[400px]">
                <img src="/slider/slide4.jpeg" alt="Banner 4" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 flex-shrink-0 hidden md:block lg:sticky lg:top-24 self-start">
            <ProductFilters />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {activeFilter === 'all' ? 'All Laptops' : activeFilter === 'premium' ? 'Premium Collection' : 'Gaming Series'}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredProducts.length} recent products
                  </p>
                  {activeFilter !== 'all' && (
                    <button
                      onClick={() => setActiveFilter('all')}
                      className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground px-2 py-1 rounded transition-colors"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>
              <Link href="/products" className="border border-border bg-background hover:bg-secondary rounded-lg px-4 py-2 text-sm text-foreground transition-colors font-medium">
                View All Catalog
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product: any) => {
                const auction = Array.isArray(product.auctions) ? product.auctions[0] : product.auctions;
                const isAuction = auction && auction.status === 'active';
                const currentBid = isAuction 
                  ? (auction.bids?.reduce((max: number, b: any) => Math.max(max, b.amount), 0) || auction.starting_bid)
                  : null;

                 if (isAuction) {
                    return (
                      <AuctionCard 
                        key={auction.id}
                        id={auction.id}
                        productId={product.id}
                        name={product.name || 'Unknown Laptop'}
                        brand={product.brand}
                        image={product.images?.[0]}
                        currentBid={currentBid}
                        numberOfBids={auction.bids?.length || 0}
                        endTime={auction.end_time}
                        rating={4.8}
                        seller="Verified Seller"
                        initialIsWatching={wishlistedProductIds.includes(product.id)}
                      />
                    );
                  }

                  return (
                    <ProductCard 
                      key={product.id} 
                      id={product.id}
                      name={product.name}
                      brand={product.brand}
                      price={product.price}
                      originalPrice={product.original_price}
                      image={product.images?.[0]}
                      rating={4.5}
                      reviews={12}
                      stock={product.stock}
                      badge={product.badge}
                      isAuction={false}
                      auctionId={null}
                      currentBid={null}
                      endTime={null}
                      initialIsWishlisted={wishlistedProductIds.includes(product.id)}
                    />
                  );
                })}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found for this filter.</p>
                <button onClick={() => setActiveFilter('all')} className="mt-4 text-primary hover:underline">View all</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative bg-gradient-to-r from-[#0A1E5B] via-[#1a3a8a] to-[#0A1E5B] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[400px]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex-1 flex flex-col items-start justify-center p-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">Contact Us</h2>
            <p className="text-lg text-white/90 mb-6 max-w-lg">Have questions, need support, or want to partner with us? Reach out and our team will get back to you as soon as possible.</p>
            <div className="space-y-2 text-white/90">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <span>info@laptophub.lk</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                <span>+94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <span>123 Tech Avenue, Colombo 03</span>
              </div>
            </div>
          </div>
          <form className="relative z-10 flex-1 flex flex-col items-center justify-center p-10 w-full md:w-auto" onSubmit={(e) => { e.preventDefault(); toast.success("Thank you! We'll get back to you soon."); }}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-4 border border-white/30">
              <input type="text" placeholder="Your Name" className="rounded-lg px-4 py-3 bg-white/5 text-white placeholder:text-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <input type="email" placeholder="Your Email" className="rounded-lg px-4 py-3 bg-white/5 text-white placeholder:text-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <textarea placeholder="Your Message" rows={3} className="rounded-lg px-4 py-3 bg-white/5 text-white placeholder:text-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md">Send Message</button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
