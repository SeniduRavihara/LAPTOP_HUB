"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import { useCountdown } from "@/hooks/use-countdown"
import { Clock, Users, ArrowUpCircle } from "lucide-react"

interface SellerAuctionDetailsClientProps {
    initialAuction: any
}

export function SellerAuctionDetailsClient({ initialAuction }: SellerAuctionDetailsClientProps) {
    const [auction, setAuction] = useState(initialAuction)
    const supabase = createClient()
    const timeLeft = useCountdown(auction?.end_time)

    useEffect(() => {
        // Real-time subscription to bids
        const channel = supabase
            .channel(`seller-auction-${auction.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'bids',
                    filter: `auction_id=eq.${auction.id}`
                },
                (payload: any) => {
                    const newBid = payload.new;
                    setAuction((prev: any) => ({
                        ...prev,
                        bids: [newBid, ...(prev.bids || [])].sort((a, b) => b.amount - a.amount)
                    }))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [auction.id, supabase])

    const currentBid = auction.bids?.reduce((max: number, bid: any) => Math.max(max, bid.amount), 0) || auction.starting_bid
    const totalBids = auction.bids?.length || 0

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            <Badge variant={auction.status === 'active' ? 'default' : 'secondary'} className={
                                auction.status === 'active' ? 'bg-green-500' : ''
                            }>
                                {auction.status.toUpperCase()}
                            </Badge>
                        </div>
                        {auction.status === 'active' && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {timeLeft.isExpired 
                                    ? "Time is up, concluding soon..." 
                                    : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m remaining`}
                            </p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Highest Bid</CardTitle>
                        <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">
                            LKR {currentBid.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Starting bid was LKR {auction.starting_bid.toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalBids}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Unique bids placed
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bid History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Bidder ID (Anonymized)</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(auction.bids || []).map((bid: any) => (
                                    <TableRow key={bid.id}>
                                        <TableCell>{new Date(bid.created_at).toLocaleString()}</TableCell>
                                        <TableCell className="font-mono text-xs">{bid.bidder_id.substring(0, 8)}***</TableCell>
                                        <TableCell className="text-right font-semibold text-primary">
                                            LKR {bid.amount.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!auction.bids || auction.bids.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                                            No bids have been placed yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
