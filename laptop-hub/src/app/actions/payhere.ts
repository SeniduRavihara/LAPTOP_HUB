"use server";

import { PayHereService } from "@/services/payhere/payhere-service";
import { OrderService } from "@/services/order-service";
import { createClient } from "@/lib/supabase/server";

export async function initializePayHerePayment(
  orderData: any,
  cartItems: any[]
) {
  try {
    const supabase = await createClient();
    
    // 1. Create the order in the database
    // The trigger will automatically generate the payment_reference (ORD-YYYYMMDD-NNN)
    const order = await OrderService.createOrder(supabase, orderData, cartItems);

    if (!order || !order.payment_reference) {
      throw new Error("Failed to generate order reference.");
    }

    const orderId = order.payment_reference;
    const amount = order.total_amount.toString();
    const currency = "LKR";

    // 2. Generate secure hash server-side
    const hash = PayHereService.generateHash(orderId, amount, currency);

    // 3. Prepare parameters for the PayHere form
    const isSandbox = process.env.NEXT_PUBLIC_PAYHERE_MODE !== "live";
    const checkoutUrl = isSandbox
      ? "https://sandbox.payhere.lk/pay/checkout"
      : "https://www.payhere.lk/pay/checkout";

    const params = {
      merchant_id: PayHereService.getMerchantId(),
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payhere/notify`,
      order_id: orderId,
      items: `Order ${orderId}`,
      currency: currency,
      amount: amount,
      first_name: orderData.customer_name?.split(" ")[0] || "Customer",
      last_name: orderData.customer_name?.split(" ").slice(1).join(" ") || "Hub",
      email: orderData.customer_email || "",
      phone: orderData.contact_phone || "",
      address: typeof orderData.shipping_address === 'string' 
        ? orderData.shipping_address 
        : `${orderData.shipping_address.address}, ${orderData.shipping_address.city}`,
      city: typeof orderData.shipping_address === 'object' ? orderData.shipping_address.city : "Colombo",
      country: "Sri Lanka",
      hash: hash,
    };

    return {
      success: true,
      url: checkoutUrl,
      params: params,
    };
  } catch (error: any) {
    console.error("Payment initialization failed:", error);
    return { success: false, error: error.message };
  }
}
