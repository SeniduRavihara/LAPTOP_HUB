import { Badge } from "@/components/ui/badge"
import { OrderStatusSelect } from "@/components/admin/order-status-select"
import { VerifyPaymentButton } from "@/components/admin/verify-payment-button"
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
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => {
              const customerDisplay = order.customer_name || order.customer_email || order.customer_id
              const formattedDate = new Date(order.created_at).toLocaleDateString()

              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary">{order.payment_reference}</span>
                      <span className="text-[10px] text-muted-foreground opacity-50">{order.id.slice(0, 8)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{customerDisplay}</span>
                      <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                    </div>
                  </TableCell>
                  <TableCell>${order.total_amount}</TableCell>
                  <TableCell>
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="capitalize min-w-[70px] justify-center">
                        {order.payment_status}
                      </Badge>
                      {! (order.payment_status === 'paid') && (
                        <VerifyPaymentButton 
                          paymentReference={order.payment_reference} 
                          isPaid={false} 
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formattedDate}</TableCell>
                </TableRow>
              )
            })}
             {orders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24"> {/* Updated colSpan from 5 to 6 */}
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
