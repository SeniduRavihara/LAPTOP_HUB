import { OrderStatusSelect } from "@/components/admin/order-status-select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"

export default async function OrdersPage() {
  const supabase = await createClient()

  // Fetch orders
  // Note: RLS might hide orders if not admin-enabled correctly.
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => {
              // Try to get customer name from shipping_address if available
              const customerName = (order.shipping_address as any)?.name || order.customer_id
              const formattedDate = new Date(order.created_at).toLocaleDateString()

              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>{customerName}</TableCell>
                  <TableCell>${order.total_amount}</TableCell>
                  <TableCell>
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </TableCell>
                  <TableCell>{formattedDate}</TableCell>
                </TableRow>
              )
            })}
             {orders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
