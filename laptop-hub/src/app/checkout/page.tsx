"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [payHereParams, setPayHereParams] = useState<any>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, router]);

  // Auto-submit form when params are ready
  useEffect(() => {
    if (payHereParams && formRef.current) {
      formRef.current.submit();
    }
  }, [payHereParams]);

  const subtotal = cartTotal;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        customer_id: user?.id,
        customer_name: formData.fullName,
        customer_email: formData.email,
        total_amount: total,
        status: "pending",
        shipping_address: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        contact_phone: formData.phone,
      };

      const { initializePayHerePayment } = await import("@/app/actions/payhere");
      const result = await initializePayHerePayment(orderData, cartItems);

      if (result.success && result.params) {
        setPayHereParams(result);
        // sessionStorage.setItem("shipping_info", JSON.stringify(formData)); // Not needed anymore as we redirect
      } else {
        throw new Error(result.error || "Failed to initialize payment.");
      }
    } catch (error: any) {
      console.error("Payment initialization failed:", error);
      alert(error.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/cart" className="hover:text-foreground">Cart</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Checkout</span>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-xl font-bold text-foreground mb-6">Shipping Information</h2>
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+94 7X XXX XXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Shipping Address</Label>
                    <Input
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Street Name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Colombo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="10100"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold text-foreground">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold text-foreground">
                        LKR {subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span className="font-semibold text-foreground">
                        LKR {tax.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold text-foreground text-green-600">
                        {shipping === 0 ? "Free" : `LKR ${shipping.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground text-lg">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        LKR {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  form="checkout-form"
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg font-semibold text-base"
                >
                  {isProcessing ? "Redirecting to PayHere..." : "Proceed to Payment"}
                </Button>

                {/* Hidden PayHere Form */}
                {payHereParams && (
                  <form 
                    ref={formRef}
                    method="post" 
                    action={payHereParams.url}
                    className="hidden"
                  >
                    {Object.entries(payHereParams.params).map(([key, value]) => (
                      <input key={key} type="hidden" name={key} value={value as string} />
                    ))}
                  </form>
                )}
                <Link href="/cart">
                  <Button variant="ghost" className="w-full mt-4 text-muted-foreground hover:text-foreground">
                    Back to Cart
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
