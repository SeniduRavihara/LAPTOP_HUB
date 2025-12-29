'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CheckoutFormProps {
  cartItems: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
}

export default function CheckoutPage() {
  // In a real app, you would get cart data from a state management solution or API
  const cartItems = [
    {
      id: 1,
      name: 'Dell XPS 13 Plus',
      price: 1299,
      quantity: 1,
      image: '/placeholder.svg?key=6xdaw',
    },
    {
      id: 2,
      name: 'MacBook Air M2',
      price: 1199,
      quantity: 1,
      image: '/placeholder.svg?key=88r7h',
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const shipping = subtotal > 100 ? 0 : 9.99
  const total = subtotal + tax + shipping

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
          <span className="text-foreground">Checkout</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase securely</p>
      </div>

      {/* Checkout Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <CheckoutForm
          cartItems={cartItems}
          subtotal={subtotal}
          tax={tax}
          shipping={shipping}
          total={total}
        />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}

function CheckoutForm({ cartItems, subtotal, tax, shipping, total }: CheckoutFormProps) {
  const router = useRouter()

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleContinueToPayment = () => {
    // Validate form
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || 
        !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || 
        !shippingInfo.state || !shippingInfo.zipCode) {
      alert('Please fill in all required fields')
      return
    }

    // Store shipping info in sessionStorage or state management
    sessionStorage.setItem('shippingInfo', JSON.stringify(shippingInfo))
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems))
    sessionStorage.setItem('orderTotals', JSON.stringify({ subtotal, tax, shipping, total }))

    // Navigate to payment page
    router.push('/payment')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Shipping Information Form */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Delivery Address</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={shippingInfo.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={shippingInfo.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={shippingInfo.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                placeholder="123 Main Street, Apt 4B"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Province *</Label>
                <Input
                  id="state"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleInputChange}
                  placeholder="NY"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP / Postal Code *</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleInputChange}
                  placeholder="10001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
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
              <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span className="font-semibold text-foreground">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-semibold text-foreground">
                {shipping === 0 ? (
                  <span className="text-green-600 font-semibold">Free</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button 
            className="w-full mt-6" 
            size="lg"
            onClick={handleContinueToPayment}
          >
            Continue to Payment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <div className="mt-4 text-center">
            <Link href="/cart" className="text-sm text-accent hover:underline">
              ← Back to Cart
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
