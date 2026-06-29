import { createClient } from "@/lib/supabase/server"
import { AuthService } from "@/services/auth-service"
import { OrderService } from "@/services/order-service"
import { SellerOrdersClient } from "./orders-client"

export default async function SellerOrdersPage() {
  const supabase = await createClient()
  const user = (await AuthService.getUser(supabase)) as any

  if (!user) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
        Please log in to view your sales.
      </div>
    )
  }

  // Fetch all orders for this seller at once
  const orderItemsData = await OrderService.getSellerOrderItems(user.id, supabase)
  const orderItems = (orderItemsData || []) as any[]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales Orders</h2>
      </div>

      <SellerOrdersClient initialOrderItems={orderItems} />
    </div>
  )
}
