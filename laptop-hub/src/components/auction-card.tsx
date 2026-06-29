"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { wishlistService } from "@/services/wishlist-service";
import { toast } from "sonner";

interface AuctionCardProps {
  id: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  currentBid: number;
  numberOfBids: number;
  endTime: string;
  rating: number;
  seller: string;
  initialIsWatching?: boolean;
}

export function AuctionCard({
  id,
  productId,
  name,
  brand,
  image,
  currentBid,
  numberOfBids,
  endTime,
  rating,
  seller,
  initialIsWatching = false,
}: AuctionCardProps) {
  const { user } = useAuth();
  const [isWatching, setIsWatching] = useState(initialIsWatching);
  const [isLoading, setIsLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(image || "/placeholder.svg");
  const timeLeft = new Date(endTime).toLocaleDateString(); // Simple placeholder

  // Sync state if prop changes
  useEffect(() => {
    setIsWatching(initialIsWatching);
  }, [initialIsWatching]);
  
  const handleWatchToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      setIsLoading(true);
      if (isWatching) {
        await wishlistService.removeFromWishlist(productId, user.id);
        setIsWatching(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistService.addToWishlist(productId, user.id);
        setIsWatching(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error("Failed to update wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/auctions/${id}`}>
      <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 group cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="relative w-full h-48 bg-secondary overflow-hidden">
          <Image
            src={imgSrc}
            alt={name}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => {
              console.log(`Auction image failed to load: ${imgSrc}`);
              setImgSrc("/placeholder.svg");
            }}
          />
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Auction
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="text-white text-xs font-semibold">{timeLeft}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs text-muted-foreground font-medium mb-1">
            {brand}
          </p>
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Rating and Seller */}
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-muted-foreground">{rating}</span>
            </div>
            <span className="text-muted-foreground">by {seller}</span>
          </div>

          {/* Bid Info */}
          <div className="border-t border-border pt-3 mb-3">
            <p className="text-xs text-muted-foreground mb-1">Current Bid</p>
            <p className="text-xl font-bold text-primary mb-1">
              LKR {currentBid.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {numberOfBids} bids placed
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9 font-medium transition-colors text-sm"
            >
              Place Bid
            </Button>
            <button
              onClick={handleWatchToggle}
              disabled={isLoading}
              className={`flex-1 rounded-lg h-9 font-medium transition-colors border text-sm flex items-center justify-center gap-1 ${
                isWatching
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-border bg-secondary hover:bg-secondary/80 text-foreground"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isWatching ? "★" : "☆"} {isWatching ? "Watching" : "Watch"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
