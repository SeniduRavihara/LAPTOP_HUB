"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  badge?: string;
  isAuction?: boolean;
  currentBid?: number | null;
  endTime?: string | null;
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  image,
  rating,
  reviews,
  stock,
  badge,
  isAuction,
  currentBid,
  endTime,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgSrc, setImgSrc] = useState(image || "/placeholder.svg");

  return (
    <Link href={isAuction ? `/auctions/${id}` : `/products/${id}`}>
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
              console.log(`Image failed to load: ${imgSrc}`);
              setImgSrc("/placeholder.svg");
            }}
          />
          {isAuction ? (
            <div className="absolute top-3 right-3 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Auction
            </div>
          ) : badge && (
            <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
              {badge}
            </div>
          )}
          {stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-3 left-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <svg
              className={`w-5 h-5 ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs text-muted-foreground font-medium mb-1">
            {brand}
          </p>
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>

          {/* Price / Bid */}
          <div className="flex flex-col mb-4">
            {isAuction ? (
              <>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-tight">Current Bid</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary">
                    LKR {currentBid?.toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-tight">Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-foreground">
                    LKR {price.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    LKR {(price * 1.15).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={(e) => e.preventDefault()}
            disabled={stock === 0 && !isAuction}
            className={`w-full rounded-lg h-9 font-medium transition-all duration-300 ${
              isAuction 
                ? "bg-orange-600 hover:bg-orange-700 text-white" 
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {isAuction ? "Place Bid" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
