import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"

import { AuthService } from "@/services/auth-service"
import { OrderService } from "@/services/order-service"

export async function OrderHistory() {
  const supabase = await createClient()
  const user = (await AuthService.getUser(supabase)) as any

  if (!user || !user.id) return null
  
  const ordersResponse = await OrderService.getUserOrders(supabase, user.id)
  const orders = (ordersResponse || []) as any[]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Order History</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono">{order.id.slice(0, 8)}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={order.payment_status === 'paid' ? 'default' : 'outline'}>
                    {order.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>${order.total_amount}</TableCell>
              </TableRow>
            ))}
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
