"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, Trophy, Package, CheckCircle2, Truck } from "lucide-react";

interface WonAuctionsProps {
  userId: string
}

/** Returns a human-readable status message for the buyer side */
function getOrderStatusMessage(order: any): { text: string; color: string } | null {
  if (!order) return null;
  switch (order.status) {
    case 'pending':
      return null; // "Complete Payment" button handles this state
    case 'confirmed':
      return order.payment_method === 'cod'
        ? { text: "Order confirmed — Pay on delivery", color: "text-indigo-600" }
        : { text: "Order confirmed — Payment received", color: "text-indigo-600" };
    case 'processing':
      return { text: "Seller is preparing your order", color: "text-amber-600" };
    case 'shipped':
      return { text: "Your laptop is on the way!", color: "text-blue-600" };
    case 'delivered':
      return { text: "Delivered — Enjoy your laptop! 🎉", color: "text-emerald-600" };
    default:
      return { text: order.status, color: "text-muted-foreground" };
  }
}

export function WonAuctions({ userId }: WonAuctionsProps) {
  const [wonAuctions, setWonAuctions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWonAuctions() {
      try {
        // Fetch user's bids
        const { data: bids, error: bidsError } = await supabase
          .from("bids")
          .select(`
            id,
            amount,
            auction_id,
            auctions:auction_id (
              id,
              status,
              end_time,
              product_id,
              products:product_id (
                name,
                images
              ),
              bids (
                amount,
                bidder_id
              )
            )
          `)
          .eq("bidder_id", userId)

        if (bidsError) throw bidsError

        // Group bids by auction and find if user is the winner
        const auctionBidsMap = new Map();
        bids?.forEach((bid: any) => {
          if (!auctionBidsMap.has(bid.auction_id) || bid.amount > auctionBidsMap.get(bid.auction_id).amount) {
            auctionBidsMap.set(bid.auction_id, bid);
          }
        });

        const uniqueBids = Array.from(auctionBidsMap.values());
        
        // Filter out completed auctions where user's max bid is the overall max bid
        const wonAuctionsRaw = uniqueBids.filter(bid => {
          const isCompleted = bid.auctions.status === 'completed';
          if (!isCompleted) return false;
          
          const overallMaxBid = bid.auctions.bids?.reduce((max: number, b: any) => Math.max(max, b.amount), 0) || 0;
          return bid.amount === overallMaxBid;
        });

        if (wonAuctionsRaw.length === 0) {
          setWonAuctions([]);
          setLoading(false);
          return;
        }

        // Fetch auction orders for the won auctions (only ORD-AUC-prefixed orders)
        const { data: userOrders, error: ordersError } = await supabase
          .from("orders")
          .select("id, status, payment_status, payment_method, order_items(product_id), payment_reference")
          .eq("customer_id", userId)
          .like("payment_reference", "ORD-AUC-%");

        const productOrderMap: Record<string, any> = {};
        if (!ordersError && userOrders) {
          userOrders.forEach((o: any) => {
            o.order_items?.forEach((item: any) => {
              productOrderMap[item.product_id] = o;
            });
          });
        }

        const formattedAuctions = wonAuctionsRaw.map(bid => ({
          ...bid,
          order: productOrderMap[bid.auctions.product_id] || null
        }));

        setWonAuctions(formattedAuctions.sort((a, b) => new Date(b.auctions.end_time).getTime() - new Date(a.auctions.end_time).getTime()));

      } catch (error) {
        console.error("Error fetching won auctions:", error);
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchWonAuctions()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-medium">Won Auctions</h3>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Winning Bid</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wonAuctions.map((bid) => {
              const order = bid.order;
              const statusMsg = getOrderStatusMessage(order);
              
              return (
                <TableRow key={bid.id}>
                  <TableCell className="font-medium flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center overflow-hidden shrink-0 border">
                        {bid.auctions.products.images?.[0] ? (
                            <img src={bid.auctions.products.images[0]} alt={bid.auctions.products.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-muted-foreground">No img</span>
                        )}
                    </div>
                    <span className="line-clamp-1">{bid.auctions.products.name}</span>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    LKR {Number(bid.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {order ? (
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className={
                        order.status === 'delivered' ? 'bg-green-500 hover:bg-green-600' :
                        order.status === 'shipped' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                        order.status === 'processing' ? 'bg-amber-500 hover:bg-amber-600 text-white' :
                        order.status === 'confirmed' ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : ''
                      }>
                        {order.status}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Generating order...</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {order && (
                      <Badge variant={order.payment_status === 'paid' ? 'default' : 'outline'} className={order.payment_status === 'paid' ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white' : ''}>
                        {order.payment_status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/auctions/${bid.auction_id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ExternalLink className="w-4 h-4" />
                            <span className="sr-only">View Auction</span>
                          </Button>
                        </Link>

                        {/* Show "Complete Payment" only if order is still pending */}
                        {order && order.status === 'pending' && order.payment_status === 'pending' && (
                          <Link href={`/checkout?orderId=${order.id}`}>
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-8">
                              Complete Payment
                            </Button>
                          </Link>
                        )}
                      </div>

                      {/* Status message for post-payment states */}
                      {statusMsg && (
                        <span className={`text-xs font-medium flex items-center gap-1 ${statusMsg.color}`}>
                          {order.status === 'shipped' && <Truck className="w-3 h-3" />}
                          {order.status === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
                          {order.status === 'processing' && <Package className="w-3 h-3" />}
                          {statusMsg.text}
                        </span>
                      )}

                      {/* If no order yet (still being generated) */}
                      {!order && (
                        <span className="text-xs text-muted-foreground">Awaiting order generation...</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {wonAuctions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Trophy className="w-8 h-8 opacity-20" />
                    <p>You haven't won any auctions yet.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
