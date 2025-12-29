'use client'

import { Navbar } from '@/components/navbar'
import { ProductFilters } from '@/components/product-filters'
import { AuctionCard } from '@/components/auction-card'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const auctionListings = [
  {
    id: '1',
    name: 'Dell XPS 15 Plus Premium Edition - Limited Time Auction',
    brand: 'Dell',
    image: '/placeholder.svg?key=1aqpe',
    currentBid: 1450,
    numberOfBids: 23,
    timeLeft: '2 hours left',
    rating: 4.8,
    seller: 'TechStore_Pro',
  },
  {
    id: '2',
    name: 'MacBook Pro 16" M2 Max - Rare Configuration Auction',
    brand: 'Apple',
    image: '/placeholder.svg?key=2bqpe',
    currentBid: 2100,
    numberOfBids: 45,
    timeLeft: '5 hours left',
    rating: 4.9,
    seller: 'AppleReseller',
  },
  {
    id: '3',
    name: 'Gaming Laptop Auction - RTX 4080 Beast Machine',
    brand: 'ASUS',
    image: '/placeholder.svg?key=3cqpe',
    currentBid: 1800,
    numberOfBids: 38,
    timeLeft: '8 hours left',
    rating: 4.7,
    seller: 'GamingGear_Co',
  },
  {
    id: '4',
    name: 'ThinkPad X1 Extreme Gen 5 - Business Laptop Auction',
    brand: 'Lenovo',
    image: '/placeholder.svg?key=4dqpe',
    currentBid: 1200,
    numberOfBids: 16,
    timeLeft: '1 day left',
    rating: 4.6,
    seller: 'BusinessTech',
  },
  {
    id: '5',
    name: 'MSI Creator Z16 HX - Content Creator Laptop Auction',
    brand: 'MSI',
    image: '/placeholder.svg?key=5eqpe',
    currentBid: 1650,
    numberOfBids: 32,
    timeLeft: '12 hours left',
    rating: 4.5,
    seller: 'CreatorHub',
  },
  {
    id: '6',
    name: 'HP Spectre x360 - Convertible Laptop Auction',
    brand: 'HP',
    image: '/placeholder.svg?key=6fqpe',
    currentBid: 950,
    numberOfBids: 12,
    timeLeft: '3 days left',
    rating: 4.4,
    seller: 'TechDeals247',
  },
]

export default function AuctionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0A1E5B] via-[#1a3a8a] to-[#0A1E5B] border-b-4 border-orange-500 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1E5B]/70 via-[#1a3a8a]/60 to-[#0A1E5B]/70"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-6 drop-shadow-lg">
            Live Auction Events
          </h1>
          <p className="text-xl text-white/95 text-center max-w-3xl mx-auto">
            Bid on exclusive and limited-edition laptops from top sellers
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters />
          </aside>

          {/* Auctions Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Active Auctions</h2>
                <p className="text-sm text-muted-foreground">Showing {auctionListings.length} live auctions</p>
              </div>
              <select className="border border-border bg-background rounded-lg px-4 py-2 text-sm text-foreground cursor-pointer">
                <option>Ending Soon</option>
                <option>Newest</option>
                <option>Most Bids</option>
                <option>Highest Price</option>
                <option>Lowest Price</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctionListings.map(auction => (
                <AuctionCard key={auction.id} {...auction} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
