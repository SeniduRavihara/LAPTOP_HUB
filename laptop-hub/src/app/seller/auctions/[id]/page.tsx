import { createClient } from "@/lib/supabase/server"
import { AuthService } from "@/services/auth-service"
import { AuctionService } from "@/services/auction-service"
import { SellerAuctionDetailsClient } from "./auction-details-client"
import { notFound } from "next/navigation"

export default async function SellerAuctionDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  const user: any = await AuthService.getUser(supabase)

  if (!user) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">Please log in to view your auctions.</p>
      </div>
    )
  }

  // Fetch auction details
  const auction: any = await AuctionService.getAuctionById(params.id, supabase)
  
  if (!auction) {
    notFound()
  }

  // Ensure the logged in user is the seller of this product
  if (auction.products?.seller_id !== user.id) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground text-red-500">You do not have permission to view this auction.</p>
      </div>
    )
  }

  let winnerProfile: { name: string | null; email: string | null } | null = null
  let associatedOrder: any | null = null

  if (auction.status === "completed" && auction.bids && auction.bids.length > 0) {
    // Find the winner (highest bidder)
    const highestBid = auction.bids.reduce((prev: any, curr: any) =>
      prev.amount > curr.amount ? prev : curr
    )
    const winnerId: string = highestBid.bidder_id

    // Fetch winner profile (name)
    const { data: profile } = await supabase
      .from("users")
      .select("name")
      .eq("id", winnerId)
      .single()
    winnerProfile = {
      name: profile?.name || null,
      email: null
    }

    // -----------------------------------------------------------------------
    // Reliable two-step query:
    // 1. Get order_item rows for the auction product (could be multiple orders
    //    in edge cases, but we'll filter by ORD-AUC winner in step 2)
    // 2. Fetch the matching order for THIS winner from orders table directly.
    //    Filtering `payment_reference LIKE 'ORD-AUC-%'` on the orders table
    //    directly (not via a join) avoids Supabase PostgREST join-filter quirks.
    // -----------------------------------------------------------------------
    const { data: orderItemRows } = await supabase
      .from("order_items")
      .select("order_id")
      .eq("product_id", auction.product_id)

    const orderIds: string[] = (orderItemRows ?? []).map((r: any) => r.order_id)

    if (orderIds.length > 0) {
      const { data: order } = await supabase
        .from("orders")
        .select("*, order_items(*, products(name, images, brand))")
        .like("payment_reference", "ORD-AUC-%")
        .eq("customer_id", winnerId)
        .in("id", orderIds)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      associatedOrder = order ?? null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Auction Details</h2>
      </div>
      <SellerAuctionDetailsClient 
        initialAuction={auction} 
        winnerProfile={winnerProfile} 
        associatedOrder={associatedOrder} 
      />
    </div>
  )
}
