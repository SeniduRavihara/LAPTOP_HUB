'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { PaymentForm } from '@/components/payment-form'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { Package, MapPin, ArrowLeft, CheckCircle } from 'lucide-react'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface OrderTotals {
  subtotal: number
  tax: number
  shipping: number
  total: number
}

export default function PaymentPage() {
  const router = useRouter()
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orderTotals, setOrderTotals] = useState<OrderTotals | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Get data from sessionStorage
    const shipping = sessionStorage.getItem('shippingInfo')
    const cart = sessionStorage.getItem('cartItems')
    const totals = sessionStorage.getItem('orderTotals')

    if (!shipping || !cart || !totals) {
      // Redirect back to checkout if data is missing
      router.push('/checkout')
      return
    }

    setShippingInfo(JSON.parse(shipping))
    setCartItems(JSON.parse(cart))
    setOrderTotals(JSON.parse(totals))
  }, [router])

  const handlePaymentSuccess = async (paymentMethod: string, transactionId: string) => {
    setIsProcessing(true)
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In a real app, you would send this to your backend
    const orderData = {
      shippingInfo,
      cartItems,
      paymentMethod,
      transactionId,
      ...orderTotals,
      orderDate: new Date().toISOString(),
    }

    console.log('Order placed:', orderData)

    // Clear session storage
    sessionStorage.removeItem('shippingInfo')
    sessionStorage.removeItem('cartItems')
    sessionStorage.removeItem('orderTotals')

    // Redirect to order confirmation
    router.push(`/order-confirmation?orderId=${transactionId}`)
  }

  if (!shippingInfo || !orderTotals) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-border">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-accent hover:text-accent/80">Home</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/cart" className="text-accent hover:text-accent/80">Cart</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/checkout" className="text-accent hover:text-accent/80">Checkout</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-semibold">Payment</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-muted-foreground">Shipping</span>
          </div>
          <div className="w-16 h-0.5 bg-primary"></div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              2
            </div>
            <span className="font-semibold text-foreground">Payment</span>
          </div>
          <div className="w-16 h-0.5 bg-border"></div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">
              3
            </div>
            <span className="text-muted-foreground">Confirmation</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">Payment Information</h1>
        <p className="text-muted-foreground mb-8">Complete your payment to finish your order</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Review */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Shipping To</h2>
                </div>
                <Link href="/checkout" className="text-sm text-accent hover:underline flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" />
                  Edit
                </Link>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold text-foreground">
                  {shippingInfo.firstName} {shippingInfo.lastName}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{shippingInfo.address}</p>
                <p className="text-sm text-muted-foreground">
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                </p>
                <p className="text-sm text-muted-foreground">{shippingInfo.country}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {shippingInfo.email} • {shippingInfo.phone}
                </p>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Payment Method</h2>
              <PaymentForm
                amount={orderTotals.total}
                onPaymentSuccess={handlePaymentSuccess}
                disabled={isProcessing}
              />
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-foreground mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">${orderTotals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-semibold text-foreground">${orderTotals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold text-foreground">
                    {orderTotals.shipping === 0 ? (
                      <span className="text-green-600 font-semibold">Free</span>
                    ) : (
                      `$${orderTotals.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">${orderTotals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}