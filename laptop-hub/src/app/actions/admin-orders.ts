"use server";

import { PayHereRetrievalService } from "@/services/payhere/payhere-retrieval-service";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function verifyOrderPayment(paymentReference: string) {
  try {
    console.log(`🔍 Admin manually verifying payment: ${paymentReference}`);
    
    // 1. Fetch payment status from PayHere
    const payHereOrder = await PayHereRetrievalService.getSuccessfulPayment(paymentReference);

    if (!payHereOrder) {
      return { 
        success: false, 
        message: "Payment not found or not yet received by PayHere." 
      };
    }

    // 2. Update database using admin client
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        payhere_payment_id: payHereOrder.payment_id.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq("payment_reference", paymentReference);

    if (updateError) {
      throw updateError;
    }

    revalidatePath("/admin/orders");
    
    return { 
      success: true, 
      message: "Payment successfully verified and updated!" 
    };
  } catch (error: any) {
    console.error("Manual verification failed:", error);
    return { 
      success: false, 
      message: error.message || "An unexpected error occurred during verification." 
    };
  }
}
