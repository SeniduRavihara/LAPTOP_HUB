"use client"

import { useState, useMemo, useEffect } from "react"
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
import { Search, X, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { adminDeleteProduct } from "@/app/actions/product"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ProductsClientProps {
    initialProducts: any[]
    adminId?: string
}

export function ProductsClient({ initialProducts, adminId }: ProductsClientProps) {
    const [products, setProducts] = useState(initialProducts)
    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [onlyMyProducts, setOnlyMyProducts] = useState(!!adminId)
    const [productToDelete, setProductToDelete] = useState<any>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        setProducts(initialProducts)
    }, [initialProducts])

    const handleDelete = async () => {
        if (!productToDelete) return
        setIsDeleting(true)
        try {
            const res = await adminDeleteProduct(productToDelete.id)
            if (res.success) {
                setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
                toast({
                    title: "Product deleted",
                    description: "Product was successfully deleted from system inventory.",
                })
            } else {
                toast({
                    title: "Error deleting product",
                    description: res.error,
                    variant: "destructive",
                })
            }
        } catch (err: any) {
            toast({
                title: "Unexpected error",
                description: err.message || "An unexpected error occurred.",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
            setProductToDelete(null)
        }
    }

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const name = (product.name || "").toLowerCase()
            const brand = (product.brand || "").toLowerCase()
            const searchTerm = search.toLowerCase()
            const matchesSearch = name.includes(searchTerm) || brand.includes(searchTerm)

            const isAuction = product.auction && (
                Array.isArray(product.auction)
                    ? product.auction.some((a: any) => a.status === 'active')
                    : product.auction.status === 'active'
            )
            let matchesType = true
            if (typeFilter === "auction") matchesType = isAuction
            if (typeFilter === "standard") matchesType = !isAuction

            const isMyProduct = adminId && product.seller_id === adminId
            const matchesMyProducts = !onlyMyProducts || isMyProduct

            return matchesSearch && matchesType && matchesMyProducts
        })
    }, [products, search, typeFilter, onlyMyProducts, adminId])


    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products or brands..."
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

                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input
                        type="checkbox"
                        checked={onlyMyProducts}
                        onChange={(e) => setOnlyMyProducts(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    Show only my products
                </label>

                {(search || typeFilter !== "all" || onlyMyProducts !== !!adminId) && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSearch("")
                            setTypeFilter("all")
                            setOnlyMyProducts(!!adminId)
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
                            <TableHead className="font-semibold">Seller</TableHead>
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
                                    <span className="inline-block font-semibold text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full w-fit whitespace-nowrap">
                                        {product.seller?.name || "Unknown"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {product.auction && (Array.isArray(product.auction) ? product.auction.some((a: any) => a.status === 'active') : product.auction.status === 'active') ? (
                                        <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 border-none">Auction</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Standard</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="font-mono text-sm">LKR {product.price.toLocaleString()}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-white transition-all">
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            onClick={() => setProductToDelete(product)}
                                            className="transition-all"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredProducts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground italic">
                                    No products found matching your filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the product <strong>{productToDelete?.name}</strong> from the database. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

