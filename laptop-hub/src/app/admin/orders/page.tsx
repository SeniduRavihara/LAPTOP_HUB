import { createClient } from "@/lib/supabase/server"
import { OrdersClient } from "./orders-client"

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[OrdersPage] Error fetching data:", error)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>

      <OrdersClient initialOrders={orders || []} />
    </div>
  )
}
