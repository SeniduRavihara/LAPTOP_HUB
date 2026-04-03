"use client";

import { BidHistory } from "@/components/bid-history";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Clock, Eye, Gavel, Loader2, MapPin } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuctionService } from "@/services/auction-service";
import { useAuth } from "@/context/AuthContext";

export default function AuctionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [auction, setAuction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [isWatching, setIsWatching] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchAuction() {
      setIsLoading(true);
      try {
        const data: any = await AuctionService.getAuctionById(id, supabase);
        
        const maxBid = data.bids.reduce((max: number, bid: any) => Math.max(max, bid.amount), 0);
        setAuction({
          ...data,
          currentBid: maxBid || data.starting_bid,
          totalBids: data.bids.length,
          specs: Object.entries(data.products.specs || {}).map(([label, value]) => ({ label, value: String(value) })),
        });
      } catch (error) {
        console.error("Error fetching auction:", error);
        toast.error("Failed to load auction details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAuction();

    // Subscribe to real-time bid updates
    const channel = supabase
      .channel(`auction-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `auction_id=eq.${id}`
        },
        (payload: any) => {
          setAuction((prev: any) => {
            if (!prev) return prev;
            const newBid = payload.new;
            return {
              ...prev,
              currentBid: Math.max(prev.currentBid, newBid.amount),
              totalBids: prev.totalBids + 1,
              bids: [...(prev.bids || []), newBid]
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleBid = async () => {
    if (!bidAmount) return;
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= auction.currentBid) {
      toast.error(`Bid must be higher than current bid of ${auction.currentBid}`);
      return;
    }

    setIsBidding(true);
    try {
      if (!user) {
        toast.error("You must be logged in to place a bid");
        return;
      }

      await AuctionService.placeBid(id, user.id, amount, supabase);
      toast.success("Bid placed successfully!");
      setBidAmount("");
    } catch (error: any) {
      console.error("Error placing bid:", error);
      toast.error(error.message || "Failed to place bid");
    } finally {
      setIsBidding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-muted-foreground">Auction not found</p>
      </div>
    );
  }

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
          <span className="text-foreground font-medium">{auction.products.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-secondary border border-border rounded-lg overflow-hidden mb-4">
              <div className="relative w-full h-96">
                <Image
                  src={auction.products.images?.[0] || "/placeholder.svg"}
                  alt={auction.products.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-8">
              {(auction.products.images || []).map((image: string, idx: number) => (
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
                {auction.products.description}
              </p>

              <h3 className="text-xl font-bold text-foreground mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(auction.specs || []).map((spec: any, idx: number) => (
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
              <BidHistory bids={auction.bids || []} />
            </div>
          </div>

          {/* Right Column - Bidding */}
          <div>
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {auction.products.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{auction.products.brand}</Badge>
                  <Badge className="bg-green-500/10 text-green-600 border border-green-500/20">
                    {auction.products.specs?.Condition || "New"}
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
                  {new Date(auction.end_time).toLocaleTimeString()} {/* We can add a countdown hook later */}
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
                    {auction.watchers || 0} watching
                  </span>
                </div>
              </div>

              {/* Bid Input */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Your Bid (minimum ${auction.currentBid + 100} {/* Using 100 as default increment */}
                  )
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={`$${
                      auction.currentBid + 100
                    }`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleBid}
                    disabled={isBidding}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isBidding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Place Bid"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Minimum increment: $100
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
                      TechStore_Pro
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4
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
                      4.8 (342 sales)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    New York, NY
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
