'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SellerSidebar } from '@/components/seller-sidebar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'


interface Auction {
  id: string
  productName: string
  startingBid: number
  currentBid: number
  bids: number
  timeLeft: string
  status: 'active' | 'ended' | 'scheduled'
  startDate: string
  image: string
}

const mockAuctions: Auction[] = [
  {
    id: '1',
    productName: 'Limited Edition MacBook Air M2',
    startingBid: 999,
    currentBid: 1150,
    bids: 23,
    timeLeft: '2 days 5 hours',
    status: 'active',
    startDate: '2025-11-17',
    image: '/macbook-air-m2.png',
  },
  {
    id: '2',
    productName: 'ASUS ROG Gaming Laptop',
    startingBid: 1299,
    currentBid: 1550,
    bids: 18,
    timeLeft: '5 hours 30 min',
    status: 'active',
    startDate: '2025-11-16',
    image: '/asus-rog-gaming-laptop.jpg',
  },
  {
    id: '3',
    productName: 'Dell XPS 15 Premium',
    startingBid: 1199,
    currentBid: 1400,
    bids: 31,
    timeLeft: 'Ended',
    status: 'ended',
    startDate: '2025-11-15',
    image: '/dell-xps-13-laptop.jpg',
  },
  {
    id: '4',
    productName: 'HP Spectre x360',
    startingBid: 899,
    currentBid: 899,
    bids: 0,
    timeLeft: 'Starts in 2 days',
    status: 'scheduled',
    startDate: '2025-11-19',
    image: '/hp-pavilion-laptop.jpg',
  },
]

export default function MyAuctionsPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredAuctions = mockAuctions.filter(
    (auction) => filterStatus === 'all' || auction.status === filterStatus
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800'
      case 'ended':
        return 'bg-gray-100 text-gray-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
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
            <h1 className="text-3xl font-bold text-foreground">My Auctions</h1>
            <p className="text-muted-foreground mt-1">Manage your active and scheduled auctions</p>
          </div>
          <Link href="/seller/auctions/new">
            <Button className="bg-primary hover:bg-primary/90">
              <span className="mr-2">+</span> Create Auction
            </Button>
          </Link>
        </div>

        {/* Filter */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-4 mb-6 flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Auctions</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredAuctions.map((auction) => (
            <div key={auction.id} className="bg-card rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex">
                {/* Image */}
                <div className="w-48 h-40 flex-shrink-0">
                  <img src={auction.image || "/placeholder.svg"} alt={auction.productName} className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{auction.productName}</h3>
                      <p className="text-sm text-muted-foreground">Started: {auction.startDate}</p>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(auction.status)}`}>
                      {auction.status}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Starting Bid</p>
                      <p className="text-lg font-semibold text-foreground">${auction.startingBid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Current Bid</p>
                      <p className="text-lg font-semibold text-emerald-600">${auction.currentBid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Bids Placed</p>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
                        </svg>
                        <span className="text-lg font-semibold text-foreground">{auction.bids}</span>
                      </div>
                    </div>
                  </div>

                  {/* Time Left */}
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={`text-sm font-medium ${auction.status === 'active' ? 'text-amber-600' : 'text-muted-foreground'}`}>
                      {auction.timeLeft}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    {auction.status !== 'ended' && (
                      <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground mb-4">No auctions found.</p>
            <Link href="/seller/auctions/new">
              <Button className="bg-primary hover:bg-primary/90">Create Your First Auction</Button>
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Active Auctions</p>
            <p className="text-2xl font-bold text-emerald-600">{mockAuctions.filter((a) => a.status === 'active').length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Ended Auctions</p>
            <p className="text-2xl font-bold text-foreground">{mockAuctions.filter((a) => a.status === 'ended').length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-emerald-600">$4,100</p>
          </div>
        </div>
        
      </main>
      </div>
      <Footer />
    </>
  )
}
