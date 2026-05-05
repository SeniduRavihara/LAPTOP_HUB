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
import { DataTableFilters } from "@/components/ui/data-table-filters"

export default async function SellerOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : ""
  const status = typeof params.status === 'string' ? params.status : ""

  const supabase = await createClient()
  const user = (await AuthService.getUser(supabase)) as any

  if (!user) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
        Please log in to view your sales.
      </div>
    )
  }

  const orderItemsData = await OrderService.getSellerOrderItems(user.id, supabase, {
    search,
    status
  })
  const orderItems = (orderItemsData || []) as any[]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales Orders</h2>
      </div>

      <DataTableFilters 
        searchPlaceholder="Search by product or reference..."
        filterKey="status"
        filterLabel="Order Status"
        filterOptions={[
          { label: "Pending", value: "pending" },
          { label: "Processing", value: "processing" },
          { label: "Shipped", value: "shipped" },
          { label: "Delivered", value: "delivered" },
          { label: "Cancelled", value: "cancelled" },
        ]}
      />

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Product</TableHead>
              <TableHead className="font-semibold">Quantity</TableHead>
              <TableHead className="font-semibold">Total Price</TableHead>
              <TableHead className="font-semibold">Order Status</TableHead>
              <TableHead className="font-semibold">Payment Status</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems?.map((item: any) => {
               const product = item.products as unknown as { name: string }
                const order = item.orders as unknown as { 
                  id: string, 
                  status: string, 
                  payment_status: string,
                  created_at: string,
                  payment_reference: string
                }

               const formattedDate = new Date(order.created_at).toLocaleDateString(undefined, {
                 month: 'short', day: 'numeric', year: 'numeric'
               })

              return (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary">{order.payment_reference || "N/A"}</span>
                      <span className="text-[10px] text-muted-foreground opacity-50">{order.id.slice(0, 8)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{product.name}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="font-semibold">LKR {item.total_price.toLocaleString()}</TableCell>
                   <TableCell>
                    <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className={
                      order.status === 'delivered' ? 'bg-green-500 hover:bg-green-600' : ''
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.payment_status === 'paid' ? 'default' : 'outline'} className={
                      order.payment_status === 'paid' ? 'bg-blue-500 hover:bg-blue-600' : ''
                    }>
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formattedDate}</TableCell>
                </TableRow>
              )
            })}
             {orderItems?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-muted-foreground italic">
                  No orders found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
