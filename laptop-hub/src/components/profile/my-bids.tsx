import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { AuthService } from "@/services/auth-service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export async function MyBids() {
  const supabase = await createClient();
  const user = (await AuthService.getUser(supabase)) as any;

  if (!user || !user.id) return null;

  // Fetch bids for this user
  const { data: bids, error } = await supabase
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
    .eq("bidder_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bids:", error);
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
