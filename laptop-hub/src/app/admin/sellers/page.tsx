import { createClient } from "@/lib/supabase/server"
import { SellersClient } from "./sellers-client"

export default async function SellersPage() {
  const supabase = await createClient()

  const { data: sellers, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "seller")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[SellersPage] Error fetching data:", error)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sellers</h2>
      </div>

      <SellersClient initialSellers={sellers || []} />
    </div>
  )
}
