'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CartPage() {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {cartItems.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
                <Link href="/" className="text-accent hover:text-accent/80 font-medium">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex gap-6 hover:bg-secondary/50 transition-colors">
                    <div className="relative w-24 h-24 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                      <p className="text-lg font-bold text-primary">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-lg">
                        <button className="px-2 py-1 hover:bg-secondary">−</button>
                        <span className="px-3 py-1 border-l border-r border-border">{item.quantity}</span>
                        <button className="px-2 py-1 hover:bg-secondary">+</button>
                      </div>
                      <Button variant="outline" className="border border-border text-destructive hover:bg-destructive/10">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
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
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">Free shipping on orders over $100</p>
              )}
            </div>
            <div className="border-t border-border pt-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>
              <Link href="/checkout">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg font-semibold text-base">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
            <Link href="/">
              <Button variant="outline" className="w-full border border-border bg-background hover:bg-secondary rounded-lg h-10">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
