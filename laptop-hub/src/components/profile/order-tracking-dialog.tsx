"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, Package, Truck, CheckCircle2, ShoppingBag, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OrderTrackingDialogProps {
  isOpen: boolean
  onClose: () => void
  order: any
}

const ORDER_STAGES = [
  { id: 'pending', label: 'Order Placed', icon: ShoppingBag, description: 'We have received your order' },
  { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2, description: 'Seller has confirmed your order' },
  { id: 'processing', label: 'Processing', icon: Package, description: 'Your order is being packed' },
  { id: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
  { id: 'delivered', label: 'Delivered', icon: Check, description: 'Your order has been delivered' },
]

export function OrderTrackingDialog({ isOpen, onClose, order }: OrderTrackingDialogProps) {
  if (!order) return null

  // Determine current stage index
  const currentStageId = order.status
  let currentStageIndex = ORDER_STAGES.findIndex(stage => stage.id === currentStageId)
  
  // Handle edge cases
  if (currentStageId === 'cancelled' || currentStageId === 'refunded') {
      currentStageIndex = -1; // Specific UI for cancelled
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Track Order</span>
            <Badge variant="outline" className="font-mono text-xs">
              {order.payment_reference || order.id?.slice(0, 8)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {currentStageIndex === -1 ? (
              <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                      <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-red-600 mb-2">Order {order.status}</h3>
                  <p className="text-muted-foreground">This order has been {order.status}.</p>
              </div>
          ) : (
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-[2.25rem] top-8 bottom-8 w-0.5 bg-muted z-0"></div>
                
                {/* Stages */}
                <div className="space-y-8 relative z-10">
                  {ORDER_STAGES.map((stage, index) => {
                    const isCompleted = index <= currentStageIndex
                    const isCurrent = index === currentStageIndex
                    const Icon = stage.icon

                    return (
                      <div key={stage.id} className={`flex items-start gap-6 ${isCompleted ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-4 transition-colors ${
                          isCompleted 
                            ? 'bg-primary border-primary/20 text-primary-foreground shadow-sm' 
                            : 'bg-muted border-background text-muted-foreground'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        
                        <div className="flex flex-col pt-1.5">
                          <h4 className={`text-base font-bold ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                            {stage.label}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {stage.description}
                          </p>
                          
                          {/* Show notes (e.g. tracking number) if it's shipped and there are notes */}
                          {stage.id === 'shipped' && isCompleted && order.notes && (
                            <div className="mt-3 p-3 bg-secondary/30 border border-border/50 rounded-md">
                              <p className="text-xs font-semibold text-foreground mb-1">Tracking Information:</p>
                              <p className="text-xs text-muted-foreground whitespace-pre-wrap">{order.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
