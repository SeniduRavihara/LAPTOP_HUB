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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Auction Details</h2>
      </div>
      <SellerAuctionDetailsClient initialAuction={auction} />
    </div>
  )
}
