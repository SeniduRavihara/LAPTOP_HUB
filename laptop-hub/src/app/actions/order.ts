"use server";

import { OrderService } from "@/services/order-service";
import { createClient } from "@/lib/supabase/server";
import { PayHereService } from "@/services/payhere/payhere-service";

export async function createOrderAction(
  orderData: any,
  cartItems: any[],
  paymentMethod: 'online' | 'cod'
) {
  try {
    const supabase = await createClient();
    
    // Add payment method to order data
    const completeOrderData = {
      ...orderData,
      payment_method: paymentMethod,
      // For COD, payment is pending until delivery, but order is "confirmed" 
      // for the seller to start processing.
      status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
      payment_status: 'pending'
    };

    // 1. Create the order in the database
    const order = await OrderService.createOrder(completeOrderData, cartItems, supabase);

    if (!order || !order.payment_reference) {
      throw new Error("Failed to generate order reference.");
    }

    const orderReference = order.payment_reference;

    if (paymentMethod === 'cod') {
      return {
        success: true,
        paymentMethod: 'cod',
        orderReference: orderReference,
        redirectUrl: `/checkout/success?order_id=${orderReference}`
      };
    }

    // 2. Prepare PayHere parameters for Online payment
    const amount = order.total_amount.toString();
    const currency = "LKR";
    const hash = PayHereService.generateHash(orderReference, amount, currency);
    const isSandbox = process.env.NEXT_PUBLIC_PAYHERE_MODE !== "live";
    const checkoutUrl = isSandbox
      ? "https://sandbox.payhere.lk/pay/checkout"
      : "https://www.payhere.lk/pay/checkout";

    const params = {
      merchant_id: PayHereService.getMerchantId(),
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order_id=${orderReference}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payhere/notify`,
      order_id: orderReference,
      items: `Order ${orderReference}`,
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
      paymentMethod: 'online',
      url: checkoutUrl,
      params: params,
      orderReference: orderReference
    };

  } catch (error: any) {
    console.error("Order creation failed:", error);
    return { success: false, error: error.message };
  }
}
