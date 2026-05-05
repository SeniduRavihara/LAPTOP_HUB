"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SellerAuctionsClientProps {
    initialAuctions: any[]
}

export function SellerAuctionsClient({ initialAuctions }: SellerAuctionsClientProps) {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredAuctions = useMemo(() => {
        return initialAuctions.filter((auction) => {
            const productName = (auction.products?.name || "").toLowerCase()
            const searchTerm = search.toLowerCase()
            
            const matchesSearch = productName.includes(searchTerm)
            const matchesStatus = statusFilter === "all" || auction.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [initialAuctions, search, statusFilter])

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by product name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>

                {(search || statusFilter !== "all") && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSearch("")
                            setStatusFilter("all")
                        }}
                        className="h-10 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="rounded-md border bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="font-semibold">Product</TableHead>
                            <TableHead className="font-semibold">Start Time</TableHead>
                            <TableHead className="font-semibold">End Time</TableHead>
                            <TableHead className="font-semibold">Starting Bid</TableHead>
                            <TableHead className="font-semibold">Current Bid</TableHead>
                            <TableHead className="font-semibold text-center">Bids</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAuctions.map((auction: any) => {
                            const product = auction.products
                            const currentBid = auction.bids?.reduce((max: number, bid: any) => Math.max(max, bid.amount), 0) || auction.starting_bid

                            return (
                                <TableRow key={auction.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">{product?.name || "Unknown Product"}</TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(auction.start_time).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(auction.end_time).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-sm">LKR {auction.starting_bid.toLocaleString()}</TableCell>
                                    <TableCell className="font-semibold text-primary">LKR {currentBid.toLocaleString()}</TableCell>
                                    <TableCell className="text-center">{auction.bids?.length || 0}</TableCell>
                                    <TableCell>
                                        <Badge variant={auction.status === 'active' ? 'default' : 'secondary'} className={
                                            auction.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''
                                        }>
                                            {auction.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {filteredAuctions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-32 text-muted-foreground italic">
                                    No auctions found matching your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
