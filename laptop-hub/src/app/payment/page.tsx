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
import { OrderService } from "@/services/order-service";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function PaymentPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<any>(null);
  const [payHereParams, setPayHereParams] = useState<any>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    const info = sessionStorage.getItem("shipping_info");
    if (!info || cartItems.length === 0) {
      if (!isSuccess) router.push("/checkout");
      return;
    }
    setShippingInfo(JSON.parse(info));
  }, [cartItems, router, isSuccess]);

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

  const handlePayment = async () => {
    if (!shippingInfo) return;
    setIsProcessing(true);
    
    try {
      const orderData = {
        customer_id: user?.id,
        customer_name: shippingInfo.fullName,
        customer_email: shippingInfo.email,
        total_amount: total,
        status: "confirmed",
        payment_status: "paid",
        shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}`,
        contact_phone: shippingInfo.phone,
      };

      const { initializePayHerePayment } = await import("@/app/actions/payhere");
      const result = await initializePayHerePayment(orderData, cartItems);

      if (result.success && result.params) {
        setPayHereParams(result);
        toast.info("Redirecting to PayHere...");
        // The useEffect will handle the form submission
      } else {
        throw new Error(result.error || "Failed to initialize payment.");
      }
    } catch (error: any) {
      console.error("Payment failed:", error);
      toast.error(error.message || "Payment initialization failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-24 h-24 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Payment Successful!</h1>
            <p className="text-muted-foreground text-lg">
              Thank you for your purchase. Your order has been placed and is being processed.
            </p>
            <div className="pt-8">
              <Link href="/">
                <Button className="w-full h-12 text-lg font-semibold">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Payment Details</h1>

          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>LKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>LKR {tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : `LKR ${shipping.toLocaleString()}`}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border font-bold text-foreground text-base">
                      <span>Total Amount</span>
                      <span className="text-primary text-xl">LKR {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {shippingInfo && (
                  <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
                    <h3 className="text-sm font-bold text-foreground mb-2">Shipping to:</h3>
                    <p className="text-sm text-muted-foreground">{shippingInfo.fullName}</p>
                    <p className="text-sm text-muted-foreground">{shippingInfo.address}</p>
                    <p className="text-sm text-muted-foreground">{shippingInfo.city}, {shippingInfo.postalCode}</p>
                    <p className="text-sm text-muted-foreground">{shippingInfo.phone}</p>
                  </div>
                )}

                <div className="pt-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">Choose Payment Method</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex items-center justify-between p-4 border-2 border-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-[10px]">
                          PayHere
                        </div>
                        <span className="font-semibold text-foreground">Pay with PayHere</span>
                      </div>
                      {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      ) : (
                        <span className="text-primary font-bold"> →</span>
                      )}
                    </button>
                    
                    <button 
                      disabled 
                      className="flex items-center justify-between p-4 border border-border rounded-lg opacity-50 cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-black rounded flex items-center justify-center text-white font-bold text-[10px]">
                          Visa/Master
                        </div>
                        <span className="font-semibold text-foreground text-sm">Credit or Debit Card</span>
                      </div>
                    </button>
                  </div>
                </div>

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

                <p className="text-xs text-muted-foreground text-center italic">
                  * Secure payment processing via PayHere gateway.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
