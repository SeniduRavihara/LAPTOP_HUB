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
import { Clock, Users, ArrowUpCircle, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { closeAuctionAction } from "@/app/actions/auction"
import { OrderDetailsDialog } from "@/components/order-details-dialog"
import { toast } from "sonner"

interface SellerAuctionDetailsClientProps {
    initialAuction: any
    winnerProfile?: { name: string | null; email: string | null } | null
    associatedOrder?: any | null
}

export function SellerAuctionDetailsClient({ 
    initialAuction,
    winnerProfile,
    associatedOrder 
}: SellerAuctionDetailsClientProps) {
    const [auction, setAuction] = useState(initialAuction)
    const [isCompleting, setIsCompleting] = useState(false)
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
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

    const handleConclude = async () => {
        setIsCompleting(true)
        try {
            const res = await closeAuctionAction(auction.id)
            if (res.success) {
                toast.success("Auction concluded successfully!")
                window.location.reload()
            } else {
                toast.error(res.error || "Failed to conclude auction")
            }
        } catch (err: any) {
            toast.error(err.message || "An error occurred while concluding the auction")
        } finally {
            setIsCompleting(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Action Banners */}
            {auction.status === "active" && timeLeft.isExpired && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-amber-800 text-sm">Auction Time is Expired!</h4>
                            <p className="text-xs text-amber-700 mt-0.5">
                                The auction duration has ended. Please conclude the auction to lock in the highest bid and automatically generate the order for the winner.
                            </p>
                        </div>
                    </div>
                    <Button 
                        onClick={handleConclude} 
                        disabled={isCompleting}
                        className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
                    >
                        {isCompleting ? "Concluding..." : "Conclude & Declare Winner"}
                    </Button>
                </div>
            )}

            {auction.status === "completed" && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-emerald-800 text-sm">Auction Completed Successfully</h4>
                            <p className="text-xs text-emerald-700 mt-0.5">
                                The winning bid has been confirmed and the order has been generated. You can now view the winner's details and proceed to shipping.
                            </p>
                        </div>
                    </div>
                    {associatedOrder && (
                        <Button 
                            onClick={() => setIsOrderDialogOpen(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                        >
                            View & Fulfill Order
                        </Button>
                    )}
                </div>
            )}

            {/* Winner & Order Details Summary */}
            {auction.status === "completed" && winnerProfile && (
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <span className="bg-emerald-500 w-2.5 h-2.5 rounded-full block"></span>
                                Winner Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Name:</span>
                                <span className="font-semibold">{winnerProfile.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-semibold">{associatedOrder?.customer_email || winnerProfile.email || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Winning Bid:</span>
                                <span className="font-bold text-primary">LKR {currentBid.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {associatedOrder && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold">Order Status Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 pt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Order Ref:</span>
                                    <span className="font-mono text-xs font-semibold">{associatedOrder.payment_reference || associatedOrder.id}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Fulfillment:</span>
                                    <Badge variant="outline" className="capitalize font-semibold">{associatedOrder.status}</Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Payment:</span>
                                    <Badge variant={associatedOrder.payment_status === 'paid' ? 'default' : 'secondary'} className={`capitalize font-semibold ${
                                        associatedOrder.payment_status === 'paid' ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-transparent' : ''
                                    }`}>
                                        {associatedOrder.payment_status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

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

            {associatedOrder && (
                <OrderDetailsDialog 
                    isOpen={isOrderDialogOpen}
                    onClose={() => setIsOrderDialogOpen(false)}
                    order={associatedOrder}
                    userRole="seller"
                />
            )}
        </div>
    )
}
