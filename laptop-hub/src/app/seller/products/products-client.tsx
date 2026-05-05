"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import Link from "next/link"

interface SellerProductsClientProps {
    initialProducts: any[]
}

export function SellerProductsClient({ initialProducts }: SellerProductsClientProps) {
    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")

    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) => {
            const name = (product.name || "").toLowerCase()
            const brand = (product.brand || "").toLowerCase()
            const searchTerm = search.toLowerCase()
            const matchesSearch = name.includes(searchTerm) || brand.includes(searchTerm)
            
            const isAuction = product.auctions && (Array.isArray(product.auctions) ? product.auctions.length > 0 : !!product.auctions)
            let matchesType = true
            if (typeFilter === "auction") matchesType = isAuction
            if (typeFilter === "standard") matchesType = !isAuction

            return matchesSearch && matchesType
        })
    }, [initialProducts, search, typeFilter])

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search my inventory..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="auction">Auction</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                </Select>

                {(search || typeFilter !== "all") && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSearch("")
                            setTypeFilter("all")
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
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold">Brand</TableHead>
                            <TableHead className="font-semibold">Type</TableHead>
                            <TableHead className="font-semibold">Price</TableHead>
                            <TableHead className="font-semibold">Stock</TableHead>
                            <TableHead className="text-right font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product: any) => (
                            <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.brand}</TableCell>
                                <TableCell>
                                    {product.auctions && (Array.isArray(product.auctions) ? product.auctions.length > 0 : !!product.auctions) ? (
                                        <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 border-none">Auction</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Standard</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="font-mono text-sm">LKR {product.price.toLocaleString()}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-white transition-all">
                                        <Link href={`/seller/products/${product.id}/edit`}>
                                            Edit
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredProducts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground italic">
                                    No products match your search/filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
