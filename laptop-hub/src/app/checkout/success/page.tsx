import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function CheckoutSuccessPage(props: { searchParams: Promise<{ order_id?: string | string[] }> }) {
  const searchParams = await props.searchParams;
  const rawOrderId = searchParams.order_id;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : (rawOrderId || "Unknown");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="max-w-lg w-full shadow-lg border-primary/20">
          <CardContent className="pt-10 pb-8 px-8 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-6 text-lg">
              Thank you for your order. Your payment has been received.
            </p>

            <div className="bg-secondary/30 rounded-lg p-4 w-full mb-8 border border-border/50">
              <p className="text-sm text-muted-foreground font-medium mb-1">Order Reference Number</p>
              <p className="text-xl font-mono font-bold text-foreground">
                {orderId !== "Unknown" ? (orderId.startsWith("ORD-") ? orderId : orderId.slice(0, 8).toUpperCase()) : "N/A"}
              </p>
            </div>

            <p className="text-sm text-muted-foreground mb-8">
              The seller has been notified and will process your order soon. You can track your order status in your profile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link href="/profile" className="flex-1">
                <Button className="w-full" size="lg">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  View My Orders
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
