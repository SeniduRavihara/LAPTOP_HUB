"use client";

import { AuctionCard } from "@/components/auction-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function AuctionsPage() {
  const auctions = [
    {
      id: "1",
      name: "Dell XPS 15 - i7 16GB",
      brand: "Dell",
      image: "/placeholder.svg?key=1",
      currentBid: 1250,
      numberOfBids: 23,
      timeLeft: "2h 34m",
      condition: "Like New",
      rating: 4.8,
      seller: "TechStore_Pro",
    },
    {
      id: "2",
      name: 'MacBook Pro 14" M3',
      brand: "Apple",
      image: "/placeholder.svg?key=2",
      currentBid: 1850,
      numberOfBids: 45,
      timeLeft: "4h 12m",
      condition: "New",
      rating: 4.9,
      seller: "Apple_Reseller",
    },
    {
      id: "3",
      name: "ASUS ROG Strix G15",
      brand: "ASUS",
      image: "/placeholder.svg?key=3",
      currentBid: 950,
      numberOfBids: 18,
      timeLeft: "1h 45m",
      condition: "Good",
      rating: 4.5,
      seller: "Gamer_Zone",
    },
    {
      id: "4",
      name: "Lenovo ThinkPad X1 Carbon",
      brand: "Lenovo",
      image: "/placeholder.svg?key=4",
      currentBid: 1100,
      numberOfBids: 31,
      timeLeft: "3h 20m",
      condition: "Like New",
      rating: 4.7,
      seller: "Biz_Laptops",
    },
    {
      id: "5",
      name: "MSI Gaming Laptop",
      brand: "MSI",
      image: "/placeholder.svg?key=5",
      currentBid: 2100,
      numberOfBids: 12,
      timeLeft: "5h 50m",
      condition: "New",
      rating: 4.6,
      seller: "Pro_Gaming",
    },
    {
      id: "6",
      name: "HP Spectre x360",
      brand: "HP",
      image: "/placeholder.svg?key=6",
      currentBid: 1450,
      numberOfBids: 27,
      timeLeft: "6h 15m",
      condition: "Like New",
      rating: 4.8,
      seller: "Premium_Tech",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Live Auctions
          </h1>
          <p className="text-muted-foreground">
            Bid on premium laptops and get the best deals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search auctions..."
                className="pl-10 bg-background"
              />
            </div>
            <Select defaultValue="ending-soon">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                <SelectItem value="newly-listed">Newly Listed</SelectItem>
                <SelectItem value="most-bids">Most Bids</SelectItem>
                <SelectItem value="highest-price">Highest Price</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like-new">Like New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Auctions Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {auctions.length}
            </span>{" "}
            active auctions
          </p>
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} {...auction} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="border border-border">
            Load More Auctions
          </Button>
        </div>
      </div>
    </div>
  );
}
