"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase/client"
import { updateOrderStatusAction, markCodPaidAction } from "@/app/actions/order"
import { toast } from "sonner"
import { 
  Printer, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Package, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck
} from "lucide-react"

type OrderDetailsDialogProps = {
  isOpen: boolean
  onClose: () => void
  order: any // The order object (contains order_items, customer information, etc.)
  userRole: "admin" | "seller"
}

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]

export function OrderDetailsDialog({ isOpen, onClose, order, userRole }: OrderDetailsDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentStatus, setCurrentStatus] = useState(order?.status || "pending")
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState(order?.payment_status || "pending")
  const [trackingNotes, setTrackingNotes] = useState("")
  const [showTrackingInput, setShowTrackingInput] = useState(false)

  if (!order) return null

  // Helper to safely format address string/object
  const formatAddress = (address: any) => {
    if (!address) return "No shipping address provided"
    if (typeof address === "string") return address
    if (typeof address === "object") {
      const { address: street, city, postal_code, state, country } = address
      return [street, city, state, postal_code, country].filter(Boolean).join(", ")
    }
    return String(address)
  }

  // Handle order status update via server action
  const handleStatusChange = async (newStatus: "confirmed" | "processing" | "shipped" | "delivered") => {
    if (newStatus === "shipped" && !showTrackingInput) {
        setShowTrackingInput(true)
        return
    }

    startTransition(async () => {
      try {
        const result = await updateOrderStatusAction(
            order.id, 
            newStatus, 
            newStatus === "shipped" ? trackingNotes : undefined
        )

        if (!result.success) throw new Error(result.error)

        setCurrentStatus(newStatus)
        setShowTrackingInput(false)
        toast.success(`Order status updated to ${newStatus}`)
        router.refresh()
      } catch (error: any) {
        console.error("Error updating order status:", error)
        toast.error(error.message || "Failed to update order status")
      }
    })
  }

  /** Seller confirms they received cash for a COD order */
  const handleMarkCodPaid = () => {
    startTransition(async () => {
      try {
        const result = await markCodPaidAction(order.id)
        if (!result.success) throw new Error(result.error)
        setCurrentPaymentStatus('paid')
        toast.success("Cash payment confirmed! Order is fully complete.")
        router.refresh()
      } catch (error: any) {
        console.error("Error confirming COD payment:", error)
        toast.error(error.message || "Failed to confirm cash payment")
      }
    })
  }

  const handlePrint = () => {
    window.print()
  }

  // Extract items list
  const items = order.order_items || []
  const formattedDate = new Date(order.created_at).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Get status color/badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium capitalize">{status}</Badge>
      case "shipped":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-medium capitalize">{status}</Badge>
      case "processing":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium capitalize">{status}</Badge>
      case "confirmed":
        return <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium capitalize">{status}</Badge>
      case "cancelled":
      case "refunded":
        return <Badge variant="destructive" className="font-medium capitalize">{status}</Badge>
      default:
        return <Badge variant="secondary" className="font-medium capitalize">{status}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl border bg-white shadow-2xl print:shadow-none print:border-none print:bg-white print:max-h-none print:overflow-visible print:p-0">
        
        <DialogHeader className="sr-only">
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        
        {/* Printable Section Layout */}
        <div className="hidden print:block p-8 text-black bg-white w-full">
          <div className="flex justify-between items-start border-b pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">LAPTOP HUB</h1>
              <p className="text-sm text-slate-500 mt-1">Official Packing Slip & Invoice</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold">Order Reference: {order.payment_reference || "N/A"}</h2>
              <p className="text-sm text-slate-500">Date: {formattedDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-xs mb-2">Ship To</h3>
              <p className="font-bold text-base">{order.customer_name || "Valued Customer"}</p>
              <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">{formatAddress(order.shipping_address)}</p>
              <p className="text-sm text-slate-700 mt-1">Phone: {order.contact_phone || "N/A"}</p>
              <p className="text-sm text-slate-700">Email: {order.customer_email || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-xs mb-2">Order & Payment Info</h3>
              <p className="text-sm text-slate-700"><strong>Status:</strong> <span className="capitalize">{currentStatus}</span></p>
              <p className="text-sm text-slate-700"><strong>Payment Method:</strong> <span className="uppercase">{order.payment_method || "N/A"}</span></p>
              <p className="text-sm text-slate-700"><strong>Payment Status:</strong> <span className="capitalize">{order.payment_status || "N/A"}</span></p>
              {order.payhere_payment_id && (
                <p className="text-sm text-slate-700"><strong>Transaction ID:</strong> {order.payhere_payment_id}</p>
              )}
            </div>
          </div>

          <div className="border rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b">
                  <th className="p-3 text-sm font-semibold text-slate-600">Product Item</th>
                  <th className="p-3 text-sm font-semibold text-slate-600 text-center">Qty</th>
                  <th className="p-3 text-sm font-semibold text-slate-600 text-right">Unit Price</th>
                  <th className="p-3 text-sm font-semibold text-slate-600 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="p-3">
                      <p className="font-bold text-sm">{item.products?.name || "Product Item"}</p>
                      <p className="text-xs text-slate-500">Brand: {item.products?.brand || "Generic"}</p>
                      {item.products?.seller && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          Seller: {item.products.seller.name}
                          {item.products.seller.email ? ` (${item.products.seller.email})` : ""}
                        </p>
                      )}
                    </td>
                    <td className="p-3 text-center text-sm">{item.quantity}</td>
                    <td className="p-3 text-right text-sm">LKR {item.unit_price?.toLocaleString()}</td>
                    <td className="p-3 text-right text-sm font-bold">LKR {item.total_price?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-64 text-right">
              <div className="flex justify-between border-t pt-3 font-extrabold text-base">
                <span>Grand Total:</span>
                <span>LKR {order.total_amount ? order.total_amount.toLocaleString() : order.total_price?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-8 mt-12 text-center text-xs text-slate-400">
            Thank you for shopping at Laptop Hub! Please check all products upon receipt.
          </div>
        </div>

        {/* Dialog Standard View */}
        <div className="print:hidden">
          {/* Header */}
          <div className="bg-white border-b px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900">Order details</h2>
                {getStatusBadge(currentStatus)}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                Placed on {formattedDate}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 shadow-sm">
                <Printer className="w-4 h-4" />
                Print Packing Slip
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border p-4 rounded-xl shadow-sm flex flex-col justify-between min-w-0">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Payment Reference</span>
                <span className="text-sm font-bold text-primary font-mono mt-1 block break-all leading-snug">
                  {order.payment_reference || "N/A"}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 opacity-70 break-all">
                  ID: {order.id}
                </span>
              </div>
              <div className="bg-white border p-4 rounded-xl shadow-sm flex flex-col justify-between min-w-0">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Payment Status</span>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant={order.payment_status === "paid" ? "default" : "outline"} className={`capitalize font-semibold ${
                    order.payment_status === "paid" ? "bg-emerald-500 hover:bg-emerald-600 text-white border-transparent" : "text-amber-600 border-amber-300 bg-amber-50"
                  }`}>
                    {order.payment_status || "Pending"}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    ({order.payment_method === "cod" ? "COD" : "Online"})
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 break-all">
                  {order.payhere_payment_id ? `PayHere ID: ${order.payhere_payment_id}` : "No online gateway ID"}
                </span>
              </div>
              <div className="bg-white border p-4 rounded-xl shadow-sm flex flex-col justify-between min-w-0">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Grand Total</span>
                <span className="text-lg font-extrabold text-slate-900 mt-1 block">
                  LKR {order.total_amount ? order.total_amount.toLocaleString() : order.total_price?.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Includes taxes &amp; delivery charges
                </span>
              </div>
            </div>

            {/* Action Bar (Packing & Status Modification) */}
            {userRole === "seller" && (
              <div className="bg-white border p-4 rounded-xl shadow-sm flex flex-col justify-between items-start gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Order / Packing Action</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Update status to proceed with packing, dispatch, or completion.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                  {currentStatus === "pending" && (
                    <Button 
                        onClick={() => handleStatusChange("confirmed")} 
                        disabled={isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
                    >
                        Confirm Order
                    </Button>
                  )}
                  {currentStatus === "confirmed" && (
                    <Button 
                        onClick={() => handleStatusChange("processing")} 
                        disabled={isPending}
                        className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
                    >
                        Mark as Processing
                    </Button>
                  )}
                  {currentStatus === "processing" && (
                    <div className="flex flex-col sm:flex-row w-full gap-2">
                        {showTrackingInput && (
                            <Input 
                                placeholder="Enter tracking info (optional)"
                                value={trackingNotes}
                                onChange={(e) => setTrackingNotes(e.target.value)}
                                className="w-full sm:w-64"
                            />
                        )}
                        <Button 
                            onClick={() => handleStatusChange("shipped")} 
                            disabled={isPending}
                            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                        >
                            Mark as Shipped
                        </Button>
                    </div>
                  )}
                  {currentStatus === "shipped" && (
                    <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
                      <Button 
                          onClick={() => handleStatusChange("delivered")} 
                          disabled={isPending}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                      >
                          Mark as Delivered
                      </Button>
                      <div className="text-sm text-slate-500 font-medium flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-md">
                          <Truck className="w-4 h-4" /> Shipped - Delivery Pending
                      </div>
                    </div>
                  )}
                  {currentStatus === "delivered" && (
                    order.payment_method === "cod" && currentPaymentStatus !== "paid" ? (
                      <Button
                        onClick={handleMarkCodPaid}
                        disabled={isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Cash Received (COD)
                      </Button>
                    ) : (
                      <div className="text-sm text-emerald-600 font-bold flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-md w-full border border-emerald-100">
                          <CheckCircle2 className="w-4 h-4" /> Order Fulfilled
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* User & Shipping details split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info Card */}
              <div className="bg-white border p-5 rounded-xl shadow-sm space-y-4 min-w-0">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-2 whitespace-nowrap">
                  <User className="w-4 h-4 text-slate-500 shrink-0" />
                  Customer Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-start py-0.5 gap-3">
                    <span className="text-slate-400 font-medium shrink-0">Name:</span>
                    <span className="text-slate-800 font-bold text-right truncate">{order.customer_name || "Valued Customer"}</span>
                  </div>
                  <div className="flex justify-between items-start py-0.5 gap-3">
                    <span className="text-slate-400 font-medium shrink-0">Email:</span>
                    <span className="text-slate-800 font-medium text-right flex items-center gap-1 min-w-0">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{order.customer_email || "N/A"}</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-start py-0.5 gap-3">
                    <span className="text-slate-400 font-medium shrink-0">Phone:</span>
                    <span className="text-slate-800 font-bold text-right flex items-center gap-1 min-w-0">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{order.contact_phone || "N/A"}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="bg-white border p-5 rounded-xl shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  Shipping Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="py-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Delivery Destination
                    </span>
                    <span className="text-slate-800 font-semibold leading-relaxed block bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {formatAddress(order.shipping_address)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Truck className="w-3.5 h-3.5 text-blue-500" />
                    <span>Deliver via registered standard carrier</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items table */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-slate-800 text-sm">Package Content & Quantity</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Qty</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Price</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/50">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {item.products?.images?.[0] && (
                              <img 
                                src={item.products.images[0]} 
                                alt={item.products.name}
                                className="w-10 h-10 object-cover rounded-lg border bg-slate-100"
                              />
                            )}
                            <div>
                              <p className="font-bold text-slate-800 text-sm leading-snug">{item.products?.name || "Product Item"}</p>
                              <p className="text-xs text-slate-400 mt-0.5">Brand: {item.products?.brand || "Generic"}</p>
                              {item.products?.seller && (
                                <p className="text-xs text-indigo-600 font-semibold mt-1">
                                  Seller: {item.products.seller.name}
                                  {item.products.seller.email ? ` (${item.products.seller.email})` : ""}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center font-semibold text-slate-700 text-sm">{item.quantity}</td>
                        <td className="px-5 py-3.5 text-right font-medium text-slate-600 text-sm">LKR {item.unit_price?.toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-right font-bold text-slate-850 text-sm">LKR {item.total_price?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
