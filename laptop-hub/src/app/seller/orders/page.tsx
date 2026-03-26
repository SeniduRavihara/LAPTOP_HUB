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

export default async function SellerOrdersPage() {
  const supabase = await createClient()
  const user = (await AuthService.getUser(supabase)) as any

  if (!user) {
    return <div>Please log in to view your sales.</div>
  }

  const orderItemsData = await OrderService.getSellerOrderItems(supabase, user.id)
  const orderItems = (orderItemsData || []) as any[]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales Orders</h2>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems?.map((item: any) => {
               // Type assertions query result
               const product = item.products as unknown as { name: string }
                const order = item.orders as unknown as { 
                  id: string, 
                  status: string, 
                  payment_status: string,
                  created_at: string,
                  shipping_address?: any
                }

               const formattedDate = new Date(order.created_at).toLocaleDateString()

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.total_price}</TableCell>
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
                  <TableCell>{formattedDate}</TableCell>
                </TableRow>
              )
            })}
             {orderItems?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
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
