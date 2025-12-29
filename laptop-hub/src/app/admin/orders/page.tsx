'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { FileText } from 'lucide-react'

interface Order {
  id: string
  customer: string
  method: string
  total: string
  status: 'Processing' | 'Fulfilled' | 'Dispute' | 'Pending Payment'
  date: string
}

export default function OrdersPage() {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState('')

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#ORD-9821',
      customer: 'Sarah Johnson',
      method: 'Auction Win',
      total: '$1,450',
      status: 'Processing',
      date: 'Mar 12, 2025'
    },
    {
      id: '#ORD-9822',
      customer: 'David Kim',
      method: 'Buy Now',
      total: '$2,050',
      status: 'Fulfilled',
      date: 'Mar 11, 2025'
    },
    {
      id: '#ORD-9823',
      customer: 'Emily Carter',
      method: 'Auction Win',
      total: '$899',
      status: 'Dispute',
      date: 'Mar 11, 2025'
    },
    {
      id: '#ORD-9824',
      customer: 'Marcus Brown',
      method: 'Buy Now',
      total: '$1,199',
      status: 'Pending Payment',
      date: 'Mar 10, 2025'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Fulfilled':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Dispute':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'Pending Payment':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return ''
    }
  }

  const handleGenerateManifest = () => {
    console.log('Generating manifest for all orders')
    // Add manifest generation logic
  }

  const handleDetails = (order: Order) => {
    console.log('Viewing order details:', order.id)
    // Navigate to order details page
  }

  const handleUpdate = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setIsUpdateOpen(true)
  }

  const handleUpdateStatus = () => {
    if (selectedOrder && newStatus) {
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: newStatus as Order['status'] }
          : order
      ))
      setIsUpdateOpen(false)
      setSelectedOrder(null)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <AdminSidebar />

      {/* Header */}
      <div className="ml-64 bg-white border-b">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">ADMIN</p>
              <h1 className="text-3xl font-bold text-gray-900">Order Pipeline</h1>
              <p className="text-gray-600 mt-1">
                Track fulfillment, resolve disputes, and keep buyers informed.
              </p>
            </div>
            <Button
              className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
              onClick={handleGenerateManifest}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Manifest
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="ml-64 p-8">
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Order</TableHead>
                <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                <TableHead className="font-semibold text-gray-700">Method</TableHead>
                <TableHead className="font-semibold text-gray-700">Total</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Date</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {order.id}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {order.customer}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {order.method}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {order.total}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} font-medium px-3 py-1`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {order.date}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-700"
                        onClick={() => handleDetails(order)}
                      >
                        Details
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
                        onClick={() => handleUpdate(order)}
                      >
                        Update
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No orders found.
            </div>
          )}
        </div>
      </div>

      {/* Update Order Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of order {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Customer</Label>
              <p className="text-sm text-gray-700">{selectedOrder?.customer}</p>
            </div>
            <div className="space-y-2">
              <Label>Order Total</Label>
              <p className="text-sm text-gray-700">{selectedOrder?.total}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Order Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="Pending Payment">Pending Payment</SelectItem>
                  <SelectItem value="Dispute">Dispute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90"
              onClick={handleUpdateStatus}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </main>
      <Footer />
    </>
  )
}
