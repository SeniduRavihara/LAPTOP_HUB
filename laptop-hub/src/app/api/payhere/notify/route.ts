import { PayHereService } from "@/services/payhere/payhere-service";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase Admin Client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract data from PayHere webhook
    const merchantId = formData.get("merchant_id")?.toString() || "";
    const orderId = formData.get("order_id")?.toString() || ""; // This is our payment_reference
    const payHerePaymentId = formData.get("payment_id")?.toString() || "";
    const amount = formData.get("payhere_amount")?.toString() || "";
    const currency = formData.get("payhere_currency")?.toString() || "";
    const statusCode = formData.get("status_code")?.toString() || "";
    const md5sig = formData.get("md5sig")?.toString() || "";

    console.log(`🔔 PayHere Webhook Received for Order: ${orderId}, Status: ${statusCode}`);

    // 1. Verify Signature
    const isValid = PayHereService.verifySignature(
      merchantId,
      orderId,
      amount,
      currency,
      statusCode,
      md5sig
    );

    if (!isValid) {
      console.error(`❌ Signature verification failed for order: ${orderId}`);
      return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
    }

    // 2. Idempotency Check
    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("status, payment_status, payhere_payment_id")
      .eq("payment_reference", orderId)
      .single();

    if (!existingOrder) {
      console.error(`❌ Order not found: ${orderId}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (existingOrder.payment_status === "paid") {
      console.log(`⚠️ Order ${orderId} already processed.`);
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    // 3. Handle Status
    if (statusCode === "2") {
      // Payment Successful
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          status: "confirmed",
          payhere_payment_id: payHerePaymentId,
          updated_at: new Date().toISOString(),
        })
        .eq("payment_reference", orderId);

      if (updateError) {
        console.error(`❌ Failed to update order ${orderId}:`, updateError);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }

      console.log(`✅ Order ${orderId} marked as paid.`);
    } else if (["-1", "-2", "-3"].includes(statusCode)) {
      // Payment Failed/Cancelled/Chargedback
      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "failed",
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("payment_reference", orderId);
        
      console.log(`❌ Order ${orderId} marked as failed (Status: ${statusCode}).`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ PayHere Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
