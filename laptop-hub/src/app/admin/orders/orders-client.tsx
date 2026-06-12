"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { OrderStatusSelect } from "@/components/admin/order-status-select"
import { VerifyPaymentButton } from "@/components/admin/verify-payment-button"
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

interface OrdersClientProps {
    initialOrders: any[]
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedOrder, setSelectedOrder] = useState<any>(null)

    const filteredOrders = useMemo(() => {
        return initialOrders.filter((order) => {
            const customerName = (order.customer_name || "").toLowerCase()
            const customerEmail = (order.customer_email || "").toLowerCase()
            const reference = (order.payment_reference || "").toLowerCase()
            const searchTerm = search.toLowerCase()
            
            const matchesSearch = customerName.includes(searchTerm) || 
                                 customerEmail.includes(searchTerm) || 
                                 reference.includes(searchTerm)
            
            const matchesStatus = statusFilter === "all" || order.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [initialOrders, search, statusFilter])

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by customer or reference..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
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
                            <TableHead className="font-semibold">Order ID / Ref</TableHead>
                            <TableHead className="font-semibold">Customer</TableHead>
                            <TableHead className="font-semibold">Seller(s)</TableHead>
                            <TableHead className="font-semibold">Total</TableHead>
                            <TableHead className="font-semibold text-center">Status</TableHead>
                            <TableHead className="font-semibold">Payment</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.map((order) => {
                            const customerDisplay = order.customer_name || order.customer_email || order.customer_id
                            const formattedDate = new Date(order.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })

                            return (
                                <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-mono text-xs">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-primary">{order.payment_reference}</span>
                                            <span className="text-[10px] text-muted-foreground opacity-50">{order.id.slice(0, 8)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{customerDisplay}</span>
                                            <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col max-w-[150px] truncate gap-1">
                                            {(Array.from(new Set(order.order_items?.map((item: any) => item.products?.seller?.name).filter(Boolean))) as string[]).map((sellerName: string, idx: number) => (
                                                <span key={idx} className="font-semibold text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full w-fit">
                                                    {sellerName}
                                                </span>
                                            ))}
                                            {(!order.order_items || order.order_items.length === 0) && (
                                                <span className="text-xs text-muted-foreground">N/A</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold">LKR {order.total_amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className={`capitalize min-w-[70px] justify-center ${
                                                order.payment_status === 'paid' ? 'bg-green-500 hover:bg-green-600' : ''
                                            }`}>
                                                {order.payment_status}
                                            </Badge>
                                            {!(order.payment_status === 'paid') && (
                                                <VerifyPaymentButton 
                                                    paymentReference={order.payment_reference} 
                                                    isPaid={false} 
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{formattedDate}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedOrder(order)}
                                            className="h-8 px-2 flex items-center gap-1 ml-auto text-primary hover:text-primary-semibold"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {filteredOrders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center h-32 text-muted-foreground italic">
                                    No orders found matching your filters.
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
                    userRole="admin"
                />
            )}
        </div>
    )
}

