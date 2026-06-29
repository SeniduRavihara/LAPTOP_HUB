import { createClient } from "@/lib/supabase/server"
import { AuthService } from "@/services/auth-service"
import { AuctionService } from "@/services/auction-service"
import { SellerAuctionsClient } from "./auctions-client"

export default async function SellerAuctionsPage() {
  const supabase = await createClient()
  const user: any = await AuthService.getUser(supabase)

  if (!user) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">Please log in to view your auctions.</p>
      </div>
    )
  }

  // Fetch all seller auctions once
  const auctions = (await AuctionService.getSellerAuctions(user.id, supabase)) as any[]

  // Fetch orders for completed auctions to get payment status
  const completedAuctions = auctions.filter(a => a.status === 'completed');
  const productIds = completedAuctions.map(a => a.product_id);
  
  let orderPaymentStatusMap: Record<string, string> = {};
  
  if (productIds.length > 0) {
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, orders!inner(payment_status, payment_reference)')
        .in('product_id', productIds)
        .like('orders.payment_reference', 'ORD-AUC-%');
        
      if (orderItems) {
          orderItems.forEach((item: any) => {
              if (item.orders) {
                  orderPaymentStatusMap[item.product_id] = item.orders.payment_status;
              }
          });
      }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Auctions</h2>
      </div>

      <SellerAuctionsClient initialAuctions={auctions || []} orderPaymentStatusMap={orderPaymentStatusMap} />
    </div>
  )
}
