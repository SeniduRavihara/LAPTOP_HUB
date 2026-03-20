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
import { createClient } from "@/lib/supabase/client";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAuctions() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("auctions")
          .select(`
            *,
            products (*),
            bids (amount)
          `)
          .eq("status", "active")
          .order("end_time", { ascending: true });

        if (error) throw error;

        const formattedAuctions = data.map((auction: any) => {
          const maxBid = auction.bids.reduce((max: number, bid: any) => Math.max(max, bid.amount), 0);
          return {
            id: auction.id,
            name: auction.products.name,
            brand: auction.products.brand,
            image: auction.products.images?.[0] || "/placeholder.svg",
            currentBid: maxBid || auction.starting_bid,
            numberOfBids: auction.bids.length,
            endTime: auction.end_time,
            condition: auction.products.specs?.Condition || "New", // Assuming condition is in specs
            seller: "TechStore_Pro", // Placeholder or fetch seller name
          };
        });

        setAuctions(formattedAuctions);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAuctions();
  }, []);

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
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} {...auction} />
            ))}
          </div>
        )}

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
