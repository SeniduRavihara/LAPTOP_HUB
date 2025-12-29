'use client'

import { Navbar } from '@/components/navbar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Package, Truck, MapPin } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Footer } from '@/components/footer'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'N/A'
  
  // In a real app, you would fetch order details from your backend using the orderId
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-border">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-accent hover:text-accent/80">Home</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Order Confirmation</span>
        </div>
      </div>

      {/* Success Message */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Order Number</h3>
              <p className="text-muted-foreground font-mono text-sm">{orderId}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Order Date</h3>
              <p className="text-muted-foreground">{orderDate}</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dell XPS 13 Plus x 1</span>
                <span className="font-semibold text-foreground">$1,299.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">MacBook Air M2 x 1</span>
                <span className="font-semibold text-foreground">$1,199.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">$2,498.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-semibold text-foreground">$199.84</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold text-foreground">Free</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">$2,697.84</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Order Status Timeline */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-6">Order Status</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary p-2">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Order Confirmed</h4>
                <p className="text-sm text-muted-foreground">Your order has been confirmed and is being processed.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 opacity-50">
              <div className="rounded-full bg-secondary border-2 border-border p-2">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Processing</h4>
                <p className="text-sm text-muted-foreground">We're preparing your items for shipment.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 opacity-50">
              <div className="rounded-full bg-secondary border-2 border-border p-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Shipped</h4>
                <p className="text-sm text-muted-foreground">Your order is on its way.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 opacity-50">
              <div className="rounded-full bg-secondary border-2 border-border p-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Delivered</h4>
                <p className="text-sm text-muted-foreground">Your order has been delivered.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Confirmation Email Notice */}
        <Card className="p-6 mb-8 bg-secondary/30">
          <p className="text-sm text-foreground">
            <strong>What's next?</strong> We've sent a confirmation email to your registered email address with your order details and tracking information. You can also track your order status in your account dashboard.
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/">Continue Shopping</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-border"
          >
            <Link href="/seller/orders">View My Orders</Link>
          </Button>
        </div>
      </div>
    </>
  )
}

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading...</div>
        </div>
      }>
        <OrderConfirmationContent />
      </Suspense>

      {/* Footer */}
      <Footer />
    </main>
  )
}
