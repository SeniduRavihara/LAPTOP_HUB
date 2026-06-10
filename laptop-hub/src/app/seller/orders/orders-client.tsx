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
import { Eye, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderDetailsDialog } from "@/components/order-details-dialog"

interface SellerOrdersClientProps {
    initialOrderItems: any[]
}

export function SellerOrdersClient({ initialOrderItems }: SellerOrdersClientProps) {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedOrder, setSelectedOrder] = useState<any>(null)

    const filteredItems = useMemo(() => {
        return initialOrderItems.filter((item) => {
            const productName = (item.products?.name || "").toLowerCase()
            const reference = (item.orders?.payment_reference || "").toLowerCase()
            const searchTerm = search.toLowerCase()
            
            const matchesSearch = productName.includes(searchTerm) || reference.includes(searchTerm)
            const matchesStatus = statusFilter === "all" || item.orders?.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [initialOrderItems, search, statusFilter])

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by product or reference..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Order Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
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
                            <TableHead className="font-semibold">Order ID</TableHead>
                            <TableHead className="font-semibold">Product</TableHead>
                            <TableHead className="font-semibold text-center">Qty</TableHead>
                            <TableHead className="font-semibold">Total Price</TableHead>
                            <TableHead className="font-semibold">Order Status</TableHead>
                            <TableHead className="font-semibold">Payment Status</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.map((item: any) => {
                            const product = item.products
                            const order = item.orders

                            const formattedDate = new Date(order.created_at).toLocaleDateString(undefined, {
                                month: 'short', day: 'numeric', year: 'numeric'
                            })

                            return (
                                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-mono text-xs">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-primary">{order.payment_reference || "N/A"}</span>
                                            <span className="text-[10px] text-muted-foreground opacity-50">{order.id.slice(0, 8)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[200px] truncate">{product?.name || "Unknown Product"}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="font-semibold">LKR {item.total_price.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className={
                                            order.status === 'delivered' ? 'bg-green-500 hover:bg-green-600' : ''
                                        }>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'outline'} className={
                                            order.payment_status === 'paid' ? 'bg-blue-500 hover:bg-blue-600' : ''
                                        }>
                                            {order.payment_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formattedDate}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedOrder({
                                                ...order,
                                                order_items: [
                                                    {
                                                        ...item,
                                                        products: product
                                                    }
                                                ]
                                            })}
                                            className="h-8 px-2 flex items-center gap-1 ml-auto text-primary hover:text-primary-semibold"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View & Pack
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {filteredItems.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center h-32 text-muted-foreground italic">
                                    No orders found matching your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {selectedOrder && (
                <OrderDetailsDialog
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    order={selectedOrder}
                    userRole="seller"
                />
            )}
        </div>
    )
}

