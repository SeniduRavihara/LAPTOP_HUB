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
import { AuctionService } from "@/services/auction-service"

export default async function SellerAuctionsPage() {
  const supabase = await createClient()
  const user: any = await AuthService.getUser(supabase)

  if (!user) {
    return <div>Please log in to view your auctions.</div>
  }

  const auctions = (await AuctionService.getSellerAuctions(user.id, supabase)) as any[]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Auctions</h2>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Starting Bid</TableHead>
              <TableHead>Current Bid</TableHead>
              <TableHead>Total Bids</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auctions?.map((auction: any) => {
               const product = auction.products
               const currentBid = auction.bids.reduce((max: number, bid: any) => Math.max(max, bid.amount), 0) || auction.starting_bid
               
              return (
                <TableRow key={auction.id}>
                  <TableCell className="font-medium">{product?.name || "Unknown Product"}</TableCell>
                  <TableCell>{new Date(auction.start_time).toLocaleString()}</TableCell>
                  <TableCell>{new Date(auction.end_time).toLocaleString()}</TableCell>
                  <TableCell>LKR {auction.starting_bid.toLocaleString()}</TableCell>
                  <TableCell>LKR {currentBid.toLocaleString()}</TableCell>
                  <TableCell>{auction.bids.length}</TableCell>
                  <TableCell>
                    <Badge variant={auction.status === 'active' ? 'default' : 'secondary'}>
                      {auction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
             {auctions?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No auctions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
