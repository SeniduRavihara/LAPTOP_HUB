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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBids() {
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
              products:product_id (
                name
              )
            )
          `)
          .eq("bidder_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error
        setBids(data || [])
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchBids()
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
            {uniqueBids.map((bid) => (
              <TableRow key={bid.id}>
                <TableCell className="font-medium">
                  {bid.auctions.products.name}
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  LKR {Number(bid.amount).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={bid.auctions.status === 'active' ? 'default' : 'secondary'}>
                    {bid.auctions.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(bid.auctions.end_time).toLocaleDateString()}{" "}
                  {new Date(bid.auctions.end_time).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <Link href={`/auctions/${bid.auction_id}`}>
                    <Button variant="ghost" size="sm">
                      View <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
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
