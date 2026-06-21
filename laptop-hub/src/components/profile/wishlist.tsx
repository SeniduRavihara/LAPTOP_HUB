"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { ProductCard } from "@/components/product-card"

interface WishlistProps {
  userId: string
}

export function Wishlist({ userId }: WishlistProps) {
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const { data, error } = await supabase
          .from("wishlists")
          .select(`
            id,
            product_id,
            products:product_id (
              id,
              name,
              brand,
              price,
              original_price,
              images,
              stock,
              auctions:auctions(
                id,
                status,
                starting_bid,
                end_time,
                bids (
                  amount
                )
              )
            )
          `)
          .eq("user_id", userId);

        if (error) {
          console.error("Supabase returned error:", error);
          console.error("Error message:", error.message);
          console.error("Error details:", error.details);
          console.error("Error hint:", error.hint);
          throw error;
        }
        setWishlistItems(data || [])
      } catch (error: any) {
        console.error("Error fetching wishlist:", error);
        console.error("Full error object:", JSON.stringify(error, null, 2));
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchWishlist()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">My Wishlist</h3>
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          Your wishlist is empty. Start browsing and add items you love!
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">My Wishlist</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => {
          const p = item.products;
          if (!p) return null;
          
          // Check if product is an active auction
          const auction = Array.isArray(p.auctions) ? p.auctions[0] : p.auctions;
          const isAuction = auction && auction.status === 'active';
          const currentBid = isAuction 
            ? (auction.bids?.reduce((max: number, b: any) => Math.max(max, b.amount), 0) || auction.starting_bid)
            : null;

          return (
            <div key={item.id} className="h-full">
              <ProductCard
                id={p.id}
                name={p.name}
                brand={p.brand || ""}
                price={p.price}
                originalPrice={p.original_price}
                image={p.images?.[0]}
                rating={p.rating || 4.5}
                reviews={Math.floor(Math.random() * 100) + 10} // Random for now
                stock={p.stock}
                isAuction={isAuction}
                auctionId={isAuction ? auction.id : null}
                currentBid={currentBid}
                endTime={isAuction ? auction.end_time : null}
                initialIsWishlisted={true}
              />
            </div>
          )
        })}
      </div>
    </div>
  );
}
