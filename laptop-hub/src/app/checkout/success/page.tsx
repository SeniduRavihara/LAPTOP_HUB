import React, { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PayHereRetrievalService } from "@/services/payhere/payhere-retrieval-service";
import { redirect } from "next/navigation";

interface SuccessPageProps {
  searchParams: Promise<{ order_id?: string }>;
}

async function VerifyPayment({ orderId }: { orderId: string }) {
  const supabase = await createClient();
  
  // 1. Check local database first
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, payment_status, total_amount, payment_reference")
    .eq("payment_reference", orderId)
    .single();

  if (orderError || !order) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find an order with reference: {orderId}</p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  // 2. If already paid in DB, show success
  if (order.payment_status === "paid") {
    return <SuccessDisplay order={order} />;
  }

  // 3. If not paid, verify with PayHere Retrieval API
  console.log(`🔍 Verifying payment ${orderId} via Retrieval API...`);
  const payHereOrder = await PayHereRetrievalService.getSuccessfulPayment(orderId);

  if (payHereOrder) {
    // 4. Update database if verified via API (webhook might be slow)
    console.log(`✅ Payment ${orderId} verified via API. Updating DB...`);
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        payhere_payment_id: payHereOrder.payment_id.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq("payment_reference", orderId);

    if (!updateError) {
      return <SuccessDisplay order={{ ...order, payment_status: "paid" }} />;
    }
  }

  // 5. Still pending
  return (
    <div className="text-center py-12">
      <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
      <h2 className="text-2xl font-bold mb-2">Verification Pending</h2>
      <p className="text-muted-foreground mb-6">
        We're still waiting for the payment confirmation. This usually takes a few seconds.
      </p>
      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        <Link href={`/checkout/success?order_id=${orderId}`}>
          <Button className="w-full">
            Refresh Status
          </Button>
        </Link>
        <Link href="/profile?tab=orders" className="w-full">
          <Button variant="outline" className="w-full">View My Orders</Button>
        </Link>
      </div>
    </div>
  );
}

function SuccessDisplay({ order }: { order: any }) {
  return (
    <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full scale-110"></div>
        <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10" />
      </div>
      <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
      <p className="text-muted-foreground mb-2">Your order has been confirmed and is being processed.</p>
      <p className="font-mono text-sm bg-muted inline-block px-3 py-1 rounded-full mb-8">
        Reference: {order.payment_reference}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
        <Link href="/profile?tab=orders" className="w-full">
          <Button className="w-full h-12 text-base font-semibold">
            Track Order <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
        <Link href="/" className="w-full">
          <Button variant="outline" className="w-full h-12 text-base">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { order_id } = await searchParams;
  
  // Handle case where order_id might be an array due to duplication
  const orderId = Array.isArray(order_id) ? order_id[0] : order_id;

  if (!orderId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container max-w-2xl mx-auto py-20 px-4">
        <section className="bg-card border rounded-2xl p-8 md:p-12 shadow-sm border-border/50">
          <Suspense fallback={
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-primary/40 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
              <p className="text-muted-foreground">Please wait while we confirm your transaction.</p>
            </div>
          }>
            <VerifyPayment orderId={orderId as string} />
          </Suspense>
        </section>
      </main>
      <Footer />
    </div>
  );
}
