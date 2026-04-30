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
  
  const ordersResponse = await OrderService.getUserOrders(user.id, supabase)
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
              <TableHead>Payment Status</TableHead>
              <TableHead>Payment Method</TableHead>
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
                <TableCell>
                  <Badge variant="outline" className={order.payment_method === 'cod' ? 'border-orange-500 text-orange-600 bg-orange-500/10' : 'border-blue-500 text-blue-600 bg-blue-500/10'}>
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">LKR {Number(order.total_amount).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {orders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
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
