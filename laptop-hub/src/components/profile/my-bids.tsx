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
import { ExternalLink, Loader2 } from "lucide-react";

interface MyBidsProps {
  userId: string
}

export function MyBids({ userId }: MyBidsProps) {
  const [bids, setBids] = useState<any[]>([])
  const [pendingOrders, setPendingOrders] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBidsAndOrders() {
      try {
        const { data, error } = await supabase
          .from("bids")
          .select(`
            id,
            amount,
            created_at,
            auction_id,
            auctions:auction_id (
              id,
              status,
              end_time,
              product_id,
              products:product_id (
                name
              ),
              bids (
                amount,
                bidder_id
              )
            )
          `)
          .eq("bidder_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error
        setBids(data || [])

        // Also fetch user's pending orders to map to won auctions
        const { data: userOrders, error: ordersError } = await supabase
          .from("orders")
          .select("id, order_items(product_id)")
          .eq("customer_id", userId)
          .eq("status", "pending");

        if (!ordersError && userOrders) {
          const mapping: Record<string, string> = {};
          userOrders.forEach((o: any) => {
            o.order_items?.forEach((item: any) => {
              mapping[item.product_id] = o.id;
            });
          });
          setPendingOrders(mapping);
        }
      } catch (error) {
        console.error("Error fetching bids or orders:", error);
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchBidsAndOrders()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Group bids by auction (showing highest bid per auction)
  const auctionBidsMap = new Map();
  bids?.forEach((bid: any) => {
    if (!auctionBidsMap.has(bid.auction_id) || bid.amount > auctionBidsMap.get(bid.auction_id).amount) {
      auctionBidsMap.set(bid.auction_id, bid);
    }
  });

  const uniqueBids = Array.from(auctionBidsMap.values());

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">My Bids</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>My Highest Bid</TableHead>
              <TableHead>Auction Status</TableHead>
              <TableHead>Ends At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueBids.map((bid) => {
              const overallMaxBid = bid.auctions.bids?.reduce((max: number, b: any) => Math.max(max, b.amount), 0) || 0;
              const isCompleted = bid.auctions.status === 'completed';
              const isWinner = isCompleted && bid.amount === overallMaxBid;
              const pendingOrderId = pendingOrders[bid.auctions.product_id];

              return (
                <TableRow key={bid.id}>
                  <TableCell className="font-medium">
                    {bid.auctions.products.name}
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    LKR {Number(bid.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {isWinner ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white border-none">
                        Won 🎉
                      </Badge>
                    ) : (
                      <Badge variant={bid.auctions.status === 'active' ? 'default' : 'secondary'}>
                        {bid.auctions.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(bid.auctions.end_time).toLocaleDateString()}{" "}
                    {new Date(bid.auctions.end_time).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Link href={`/auctions/${bid.auction_id}`}>
                      <Button variant="ghost" size="sm">
                        View <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    {isWinner && pendingOrderId && (
                      <Link href={`/checkout?orderId=${pendingOrderId}`}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-8">
                          Checkout & Pay
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {uniqueBids.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  You haven't placed any bids yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
