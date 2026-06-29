"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const subtotal = cartTotal;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = subtotal > 50000 || cartItems.length === 0 ? 0 : 2500; // Example LKR values
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/cart")}`);
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {cartItems.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground text-lg mb-4">
                  Your cart is empty
                </p>
                <Link
                  href="/"
                  className="text-accent hover:text-accent/80 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {cartItems.map((item) => (
                  <CartItemComponent 
                    key={item.id} 
                    item={item} 
                    updateQuantity={updateQuantity} 
                    removeFromCart={removeFromCart} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">
                  LKR {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-semibold text-foreground">
                  LKR {tax.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold text-foreground">
                  {shipping === 0 ? "Free" : `LKR ${shipping.toLocaleString()}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders over LKR 50,000
                </p>
              )}
            </div>
            <div className="border-t border-border pt-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">
                  LKR {total.toLocaleString()}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg font-semibold text-base"
              >
                Proceed to Checkout
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full border border-border bg-background hover:bg-secondary rounded-lg h-10"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItemComponent({ item, updateQuantity, removeFromCart }: any) {
  const [imgSrc, setImgSrc] = React.useState(item.image || "/placeholder.svg");

  return (
    <div className="p-6 flex gap-6 hover:bg-secondary/50 transition-colors">
      <div className="relative w-24 h-24 bg-secondary rounded-lg flex-shrink-0 overflow-hidden border border-border/50">
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          unoptimized
          sizes="100px"
          className="object-cover"
          onError={() => {
            console.log(`Cart item image failed to load: ${imgSrc}`);
            setImgSrc("/placeholder.svg");
          }}
        />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground font-medium mb-1">{item.brand}</p>
        <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-lg font-bold text-primary">
          LKR {item.price.toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-border rounded-lg">
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-2 py-1 hover:bg-secondary text-foreground"
          >
            −
          </button>
          <span className="px-3 py-1 border-l border-r border-border min-w-[32px] text-center text-foreground font-medium">
            {item.quantity}
          </span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-2 py-1 hover:bg-secondary text-foreground"
          >
            +
          </button>
        </div>
        <Button
          onClick={() => removeFromCart(item.id)}
          variant="outline"
          className="border border-border text-destructive hover:bg-destructive/10"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
