import { createClient } from "@/lib/supabase/server"
import { AuctionsClient } from "./auctions-client"

export default async function AuctionsPage() {
  const supabase = await createClient()

  // Fetch all auctions with joined data
  const { data: auctions, error } = await supabase
    .from("auctions")
    .select("*, products(name), bids(amount)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[AuctionsPage] Error fetching data:", error)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Auctions</h2>
      </div>

      <AuctionsClient initialAuctions={auctions || []} />
    </div>
  )
}
