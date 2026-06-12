import { supabaseAdmin } from "@/lib/supabase/admin"
import { OrdersClient } from "./orders-client"

export default async function OrdersPage() {
  // Fetch all orders with items and products using admin client to bypass RLS
  const { data: orders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*, products(*))")
    .order("created_at", { ascending: false })

  if (ordersError) {
    console.error("[OrdersPage] Error fetching orders:", ordersError)
  }

  // Fetch all seller & admin profiles to enrich product details using admin client to bypass RLS
  const { data: sellers, error: sellersError } = await supabaseAdmin
    .from("users")
    .select("id, name, role")
    .in("role", ["seller", "admin"])

  if (sellersError) {
    console.error("[OrdersPage] Error fetching sellers:", sellersError)
  }

  const sellerMap = new Map(sellers?.map(s => [
    s.id, 
    { 
      name: s.role === "admin" ? `${s.name} (Admin)` : s.name
    }
  ]) || [])

  // Map each order's items to include their seller info
  const enrichedOrders = orders?.map(order => {
    const enrichedItems = order.order_items?.map((item: any) => {
      const seller = item.products ? sellerMap.get(item.products.seller_id) : null;
      return {
        ...item,
        products: item.products ? {
          ...item.products,
          seller: seller || { name: "Unknown Seller", email: "N/A" }
        } : null
      }
    });
    return {
      ...order,
      order_items: enrichedItems
    }
  }) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>

      <OrdersClient initialOrders={enrichedOrders} />
    </div>
  )
}
