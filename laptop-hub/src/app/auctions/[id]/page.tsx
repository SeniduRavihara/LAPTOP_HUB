"use client";

import { BidHistory } from "@/components/bid-history";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Eye, Gavel, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function AuctionDetailPage() {
  const [bidAmount, setBidAmount] = useState("");
  const [isWatching, setIsWatching] = useState(false);

  const auction = {
    id: 1,
    name: "Dell XPS 15 - Premium Laptop",
    brand: "Dell",
    condition: "Like New",
    currentBid: 1250,
    minIncrement: 25,
    totalBids: 23,
    timeLeft: "2h 34m 15s",
    endTime: new Date(
      Date.now() + 2 * 60 * 60 * 1000 + 34 * 60 * 1000
    ).toISOString(),
    watchers: 47,
    seller: {
      name: "TechStore_Pro",
      rating: 4.8,
      totalSales: 342,
      location: "New York, NY",
    },
    images: [
      "/placeholder.svg?key=1",
      "/placeholder.svg?key=2",
      "/placeholder.svg?key=3",
      "/placeholder.svg?key=4",
    ],
    description:
      "Premium Dell XPS 15 laptop in like-new condition. Barely used, still under warranty. Perfect for professionals and students.",
    specs: [
      { label: "Processor", value: "Intel Core i7-12700H" },
      { label: "RAM", value: "16GB DDR5" },
      { label: "Storage", value: "512GB NVMe SSD" },
      { label: "Display", value: '15.6" FHD (1920x1080)' },
      { label: "Graphics", value: "NVIDIA RTX 3050 Ti" },
      { label: "Battery", value: "Up to 10 hours" },
      { label: "Weight", value: "4.3 lbs" },
      { label: "Warranty", value: "6 months remaining" },
    ],
  };

  const handleBid = () => {
    if (
      bidAmount &&
      parseFloat(bidAmount) >= auction.currentBid + auction.minIncrement
    ) {
      console.log("Placing bid:", bidAmount);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">
            Home
          </a>
          <span>/</span>
          <a
            href="/auctions"
            className="hover:text-foreground transition-colors"
          >
            Auctions
          </a>
          <span>/</span>
          <span className="text-foreground font-medium">{auction.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-secondary border border-border rounded-lg overflow-hidden mb-4">
              <div className="relative w-full h-96">
                <Image
                  src={auction.images[0] || "/placeholder.svg"}
                  alt={auction.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-8">
              {auction.images.map((image, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-20 rounded-lg overflow-hidden border border-border"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`View ${idx + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Description
              </h2>
              <p className="text-muted-foreground mb-6">
                {auction.description}
              </p>

              <h3 className="text-xl font-bold text-foreground mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {auction.specs.map((spec, idx) => (
                  <div key={idx}>
                    <p className="text-sm text-muted-foreground mb-1">
                      {spec.label}
                    </p>
                    <p className="font-medium text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Bid History
              </h2>
              <BidHistory />
            </div>
          </div>

          {/* Right Column - Bidding */}
          <div>
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {auction.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{auction.brand}</Badge>
                  <Badge className="bg-green-500/10 text-green-600 border border-green-500/20">
                    {auction.condition}
                  </Badge>
                </div>
              </div>

              {/* Time Left */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-600">
                    Time Remaining
                  </span>
                </div>
                <p className="text-3xl font-bold text-red-600">
                  {auction.timeLeft}
                </p>
              </div>

              {/* Current Bid */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Current Bid
                </p>
                <p className="text-4xl font-bold text-primary mb-2">
                  ${auction.currentBid}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Gavel className="w-4 h-4" />
                    {auction.totalBids} bids
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {auction.watchers} watching
                  </span>
                </div>
              </div>

              {/* Bid Input */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Your Bid (minimum ${auction.currentBid + auction.minIncrement}
                  )
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={`$${
                      auction.currentBid + auction.minIncrement
                    }`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleBid}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Place Bid
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Minimum increment: ${auction.minIncrement}
                </p>
              </div>

              {/* Watch Button */}
              <Button
                onClick={() => setIsWatching(!isWatching)}
                variant="outline"
                className="w-full mb-6"
              >
                {isWatching ? "✓ Watching" : "+ Watch This Auction"}
              </Button>

              {/* Seller Info */}
              <div className="border-t border-border pt-6">
                <h3 className="font-bold text-foreground mb-4">
                  Seller Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Seller</p>
                    <p className="font-semibold text-foreground">
                      {auction.seller.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(auction.seller.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">
                      {auction.seller.rating} ({auction.seller.totalSales}{" "}
                      sales)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {auction.seller.location}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Seller Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
