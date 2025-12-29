'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { BidHistory } from '@/components/bid-history'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function AuctionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [bidAmount, setBidAmount] = useState(1500)

  const auctionId = params.id as string
  const itemName = 'Dell XPS 15 Plus Premium Edition'
  const currentBid = '1,450'

  const handlePlaceBid = () => {
    // Navigate to confirmation page with bid details
    const queryParams = new URLSearchParams({
      amount: bidAmount.toString(),
      item: itemName,
      current: currentBid
    })
    router.push(`/auction/${auctionId}/bid-confirmation?${queryParams.toString()}`)
  }
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/auctions" className="text-sm text-accent hover:text-accent/80 mb-6 inline-block">
          ← Back to Auctions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div className="bg-secondary border border-border rounded-lg overflow-hidden mb-4">
              <div className="relative w-full h-80">
                <Image
                  src="/placeholder.svg?key=9zqpe"
                  alt="Dell XPS 15"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-secondary border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors">
                  <div className="relative w-full h-20">
                    <Image
                      src="/placeholder.svg?key=thumb"
                      alt="Thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column - Details */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="mb-4">
                <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                  Auction
                </span>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Dell XPS 15 Plus Premium Edition
                </h1>
                <p className="text-sm text-muted-foreground">Brand: Dell</p>
              </div>

              <div className="border-t border-b border-border py-4 mb-4">
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Current Bid</p>
                  <p className="text-3xl font-bold text-primary">$1,450</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Bids Placed</p>
                    <p className="text-lg font-bold text-foreground">23</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Time Left</p>
                    <p className="text-lg font-bold text-foreground">2h 15m</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Bid
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter your bid"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="flex-1"
                  />
                  <Button
                    onClick={handlePlaceBid}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-lg font-medium h-10"
                  >
                    Place Bid
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Minimum bid: $1,450 (Your bid must be at least $1,500)
                </p>
              </div>

              {/* Seller Info */}
              <div className="bg-secondary rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-lg">T</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">TechStore_Pro</p>
                    <p className="text-xs text-muted-foreground">Verified Seller</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm mb-3">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="font-medium text-foreground">4.8</span>
                  <span className="text-muted-foreground">(324 reviews)</span>
                </div>
                <Button variant="outline" className="w-full border border-border bg-background hover:bg-background/80 rounded-lg h-9">
                  View Seller Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Bid History */}
          <div className="lg:col-span-1">
            <BidHistory />

            {/* Specifications */}
            <div className="bg-card border border-border rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processor</span>
                  <span className="font-medium text-foreground">Intel Core i7-12K</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-3">
                  <span className="text-muted-foreground">RAM</span>
                  <span className="font-medium text-foreground">16GB DDR5</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-3">
                  <span className="text-muted-foreground">Storage</span>
                  <span className="font-medium text-foreground">512GB NVMe SSD</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-3">
                  <span className="text-muted-foreground">Display</span>
                  <span className="font-medium text-foreground">15.6" 4K OLED</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-3">
                  <span className="text-muted-foreground">Graphics</span>
                  <span className="font-medium text-foreground">NVIDIA RTX 4070</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card border border-border rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">About This Item</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Like-new Dell XPS 15 Plus with all original packaging. Barely used, excellent condition. Comes with warranty. Perfect for professionals and content creators. No scratches or damage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>

  )
}
