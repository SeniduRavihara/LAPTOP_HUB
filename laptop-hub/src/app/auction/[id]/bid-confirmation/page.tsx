'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { CheckCircle2, ArrowLeft, Eye, List } from 'lucide-react'

export default function BidConfirmationPage() {
    const params = useParams()
    const searchParams = useSearchParams()

    const auctionId = params.id as string
    const bidAmount = searchParams.get('amount') || '1,500'
    const itemName = searchParams.get('item') || 'Dell XPS 15 Plus Premium Edition'
    const currentBid = searchParams.get('current') || '1,450'

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Success Card */}
                <div className="bg-card border border-border rounded-lg p-8 mb-6">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Bid Placed Successfully!
                        </h1>
                        <p className="text-muted-foreground">
                            Your bid has been recorded and you'll be notified if you win the auction.
                        </p>
                    </div>

                    {/* Bid Details */}
                    <div className="bg-secondary border border-border rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Bid Details</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-muted-foreground">Item</span>
                                <span className="text-sm font-medium text-foreground text-right max-w-xs">
                                    {itemName}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-t border-border pt-4">
                                <span className="text-sm text-muted-foreground">Your Bid Amount</span>
                                <span className="text-2xl font-bold text-primary">${bidAmount}</span>
                            </div>

                            <div className="flex justify-between items-center border-t border-border pt-4">
                                <span className="text-sm text-muted-foreground">Previous Bid</span>
                                <span className="text-sm font-medium text-foreground">${currentBid}</span>
                            </div>

                            <div className="flex justify-between items-center border-t border-border pt-4">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-green-600">
                                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                    Currently Winning
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* What Happens Next */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-6 mb-6">
                        <h3 className="text-base font-semibold text-foreground mb-3">What Happens Next?</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>You'll receive email notifications if someone outbids you</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>If you win, you'll be notified when the auction ends</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>Payment instructions will be sent to your registered email</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>You can track all your bids in your account dashboard</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Link href={`/auction/${auctionId}`} className="w-full">
                            <Button
                                variant="outline"
                                className="w-full border border-border bg-background hover:bg-background/80 rounded-lg h-11"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                View Auction
                            </Button>
                        </Link>

                        <Link href="/account?tab=bids" className="w-full">
                            <Button
                                variant="outline"
                                className="w-full border border-border bg-background hover:bg-background/80 rounded-lg h-11"
                            >
                                <List className="w-4 h-4 mr-2" />
                                My Bids
                            </Button>
                        </Link>

                        <Link href="/auctions" className="w-full">
                            <Button
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-11"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Browse Auctions
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center text-sm text-muted-foreground">
                    <p>
                        Need help? Contact our{' '}
                        <Link href="/support" className="text-accent hover:text-accent/80 underline">
                            support team
                        </Link>
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    )
}
