import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { RecentOrder } from "@/services/dashboard-service"

function getInitials(name: string | null) {
  if (!name) return "??"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

interface RecentSalesProps {
  orders?: RecentOrder[]
}

export function RecentSales({ orders = [] }: RecentSalesProps) {
  if (orders.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No recent sales
      </p>
    )
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {getInitials(order.customer_name)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {order.customer_name || "Unknown"}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.customer_email || ""}
            </p>
          </div>
          <div className="ml-auto font-medium flex items-center gap-2">
            {order.payment_method === 'cod' && (
                <span className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-bold uppercase">
                    COD
                </span>
            )}
            +LKR {order.total_amount.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}
