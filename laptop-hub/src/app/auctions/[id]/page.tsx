"use client";

import { BidHistory } from "@/components/bid-history";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Clock, Eye, Gavel, Loader2, MapPin } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuctionService } from "@/services/auction-service";
import { useAuth } from "@/context/AuthContext";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

import { useCountdown } from "@/hooks/use-countdown";

import { wishlistService } from "@/services/wishlist-service";

export default function AuctionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [auction, setAuction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [isWatching, setIsWatching] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [winnerOrderId, setWinnerOrderId] = useState<string | null>(null);
  
  const supabase = createClient();
  const timeLeft = useCountdown(auction?.end_time);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAuction() {
      setIsLoading(true);
      try {
        const data: any = await AuctionService.getAuctionById(id, supabase);
        
        const maxBid = data.bids.reduce((max: number, bid: any) => Math.max(max, bid.amount), 0);
        const processedAuction = {
          ...data,
          currentBid: maxBid || data.starting_bid,
          totalBids: data.bids.length,
          specs: Object.entries(data.products.specs || {}).map(([label, value]) => ({ label, value: String(value) })),
        };
        setAuction(processedAuction);
        
        if (user) {
          const inWishlist = await wishlistService.isInWishlist(data.product_id, user.id);
          setIsWatching(inWishlist);

          // Check if the user is the winner of this auction if it is completed
          if (processedAuction.status === 'completed' && data.bids.length > 0) {
            const highestBid = data.bids.reduce((prev: any, current: any) => (prev.amount > current.amount) ? prev : current, { amount: 0 });
            if (highestBid.bidder_id === user.id) {
              const { data: orderItem } = await supabase
                .from("order_items")
                .select("order_id, orders!inner(customer_id, status)")
                .eq("product_id", data.product_id)
                .eq("orders.customer_id", user.id)
                .eq("orders.status", "pending")
                .maybeSingle();

              if (orderItem) {
                setWinnerOrderId((orderItem as any).order_id);
              }
            }
          }
        }

        // Set initial active image
        if (data.products.images?.length > 0) {
          setActiveImage(data.products.images[0]);
        }
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
          const newBid = payload.new;
          
          setAuction((prev: any) => {
            if (!prev) return prev;
            
            // Check if current user is outbid
            const userHasBid = prev.bids?.some((b: any) => b.bidder_id === user?.id);
            if (userHasBid && newBid.bidder_id !== user?.id) {
              toast.warning(`You've been outbid! Current bid is now LKR ${newBid.amount}`);
            }

            return {
              ...prev,
              currentBid: Math.max(prev.currentBid, newBid.amount),
              totalBids: prev.totalBids + 1,
              bids: prev.bids?.some((b: any) => b.id === newBid.id) 
                ? prev.bids 
                : [...(prev.bids || []), newBid]
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user?.id]);

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

      const newBid = await AuctionService.placeBid(id, user.id, amount, supabase);
      
      // Update local state immediately
      setAuction((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentBid: Math.max(prev.currentBid, newBid.amount),
          totalBids: (prev.totalBids || 0) + 1,
          bids: [newBid, ...(prev.bids || [])].sort((a, b) => b.amount - a.amount)
        };
      });

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
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (!auction) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-xl text-muted-foreground">Auction not found</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
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
                  src={activeImage || auction.products.images?.[0] || "/placeholder.svg"}
                  alt={auction.products.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-contain"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-8">
              {(auction.products.images || [])
                .filter((img: string) => img && img.trim() !== "" && img !== "undefined")
                .map((image: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(image)}
                  className={`relative w-full h-20 rounded-lg overflow-hidden border cursor-pointer transition-all ${
                    activeImage === image ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                  }`}
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
                <p className="text-3xl font-bold text-red-600 font-mono tracking-tight">
                  {timeLeft.isExpired ? (
                    "Auction Ended"
                  ) : (
                    `${timeLeft.days > 0 ? `${timeLeft.days}d ` : ""}${timeLeft.hours.toString().padStart(2, "0")}h : ${timeLeft.minutes.toString().padStart(2, "0")}m : ${timeLeft.seconds.toString().padStart(2, "0")}s`
                  )}
                </p>
              </div>

              {/* Current Bid */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Current Bid
                </p>
                <p className="text-4xl font-bold text-primary mb-2">
                  LKR {auction.currentBid.toLocaleString()}
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
              {auction.status === 'completed' ? (
                <div className="mb-6 p-4 rounded-lg bg-muted border border-border space-y-4">
                  {winnerOrderId ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-green-600 flex items-center gap-1.5 animate-pulse">
                        🎉 Congratulations! You won this auction!
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your winning bid was <strong className="text-foreground">LKR {auction.currentBid.toLocaleString()}</strong>. Please complete your checkout to claim your laptop.
                      </p>
                      <Link href={`/checkout?orderId=${winnerOrderId}`} className="block w-full">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                          Complete Checkout & Pay
                        </Button>
                      </Link>
                    </div>
                  ) : user && auction.bids?.length > 0 && auction.bids.reduce((prev: any, current: any) => (prev.amount > current.amount) ? prev : current, { amount: 0, bidder_id: "" }).bidder_id === user.id ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-green-600">
                        🎉 You won this auction!
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Order has been successfully placed / checkout completed.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-muted-foreground">
                        Auction Closed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        This auction has ended. The winning bid was <strong className="text-foreground">LKR {auction.currentBid.toLocaleString()}</strong>.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Your Bid (minimum LKR {(auction.currentBid + 1000).toLocaleString()} {/* Using 1000 as default increment */}
                    )
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        LKR
                      </span>
                      <Input
                        type="number"
                        placeholder={(auction.currentBid + 1000).toString()}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="pl-12"
                      />
                    </div>
                    <Button
                      onClick={handleBid}
                      disabled={isBidding}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isBidding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Place Bid"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Minimum increment: LKR 1,000
                  </p>
                </div>
              )}

              {/* Watch Button */}
              <Button
                onClick={async () => {
                  if (!user) {
                    toast.error("Please login to watch this auction");
                    return;
                  }
                  try {
                    setIsWishlistLoading(true);
                    if (isWatching) {
                      await wishlistService.removeFromWishlist(auction.product_id, user.id);
                      setIsWatching(false);
                      toast.success("Removed from watch list");
                    } else {
                      await wishlistService.addToWishlist(auction.product_id, user.id);
                      setIsWatching(true);
                      toast.success("Added to watch list");
                    }
                  } catch (error) {
                    console.error("Watch toggle error:", error);
                    toast.error("Failed to update watch list");
                  } finally {
                    setIsWishlistLoading(false);
                  }
                }}
                disabled={isWishlistLoading}
                variant="outline"
                className={`w-full mb-6 ${isWatching ? "bg-accent text-accent-foreground border-accent" : ""}`}
              >
                {isWatching ? "✓ Watching" : "+ Watch This Auction"}
              </Button>


            </div>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
