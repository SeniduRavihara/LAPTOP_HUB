import { createClient } from "@/lib/supabase/server"
import { AuthService } from "@/services/auth-service"
import { AuctionService } from "@/services/auction-service"
import { SellerAuctionsClient } from "./auctions-client"

export default async function SellerAuctionsPage() {
  const supabase = await createClient()
  const user: any = await AuthService.getUser(supabase)

  if (!user) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">Please log in to view your auctions.</p>
      </div>
    )
  }

  // Fetch all seller auctions once
  const auctions = (await AuctionService.getSellerAuctions(user.id, supabase)) as any[]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Auctions</h2>
      </div>

      <SellerAuctionsClient initialAuctions={auctions || []} />
    </div>
  )
}
