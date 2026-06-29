import { createClient } from "@/lib/supabase/server"
import { AuthService } from "@/services/auth-service"
import { AuctionService } from "@/services/auction-service"
import { AdminAuctionDetailsClient } from "./admin-auction-details-client"
import { notFound, redirect } from "next/navigation"

export default async function AdminAuctionDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  const user: any = await AuthService.getUser(supabase)

  if (!user) {
    redirect('/login')
  }

  // Ensure the logged in user is an admin
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground text-red-500">You do not have permission to view this page.</p>
      </div>
    )
  }

  // Fetch auction details
  const auction: any = await AuctionService.getAuctionById(params.id, supabase)
  
  if (!auction) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Auction Details</h2>
      </div>
      <AdminAuctionDetailsClient initialAuction={auction} />
    </div>
  )
}
