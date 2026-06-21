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
      // Since webhooks might not work on hosted setup without domain, mark online payments as paid immediately.
      status: 'confirmed',
      payment_status: paymentMethod === 'cod' ? 'pending' : 'paid'
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

export async function completePendingOrderAction(
  orderId: string,
  shippingData: any,
  paymentMethod: 'online' | 'cod'
) {
  try {
    const supabase = await createClient();
    
    // Fetch the order to verify and get payment reference
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      throw new Error("Order not found");
    }

    const orderReference = order.payment_reference;

    // Update order with shipping details and payment method
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        customer_name: shippingData.customer_name,
        shipping_address: shippingData.shipping_address,
        contact_phone: shippingData.contact_phone,
        payment_method: paymentMethod,
        status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
        updated_at: new Date().toISOString()
      })
      .eq("id", orderId);

    if (updateError) throw updateError;

    if (paymentMethod === 'cod') {
      return {
        success: true,
        paymentMethod: 'cod',
        orderReference: orderReference,
        redirectUrl: `/checkout/success?order_id=${orderReference}`
      };
    }

    // Prepare PayHere parameters for Online payment
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
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile`, // Go to user profile on cancellation
      notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payhere/notify`,
      order_id: orderReference,
      items: `Order ${orderReference} (Auction Won)`,
      currency: currency,
      amount: amount,
      first_name: shippingData.customer_name?.split(" ")[0] || "Customer",
      last_name: shippingData.customer_name?.split(" ").slice(1).join(" ") || "Hub",
      email: order.customer_email || "",
      phone: shippingData.contact_phone || "",
      address: typeof shippingData.shipping_address === 'string' 
        ? shippingData.shipping_address 
        : `${shippingData.shipping_address.address}, ${shippingData.shipping_address.city}`,
      city: typeof shippingData.shipping_address === 'object' ? shippingData.shipping_address.city : "Colombo",
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
    console.error("Failed to complete pending order:", error);
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: 'confirmed' | 'processing' | 'shipped' | 'delivered',
  notes?: string
) {
  try {
    const supabase = await createClient();
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Verify user is the seller of the product in this order
    const { data: orderItem, error: orderItemError } = await supabase
      .from("order_items")
      .select("product_id, products(seller_id)")
      .eq("order_id", orderId)
      .limit(1)
      .single();

    if (orderItemError || !orderItem) {
      throw new Error("Order not found or could not verify seller");
    }

    // Supabase join may return products as object or array depending on schema config — handle both
    const product: any = Array.isArray(orderItem.products)
      ? (orderItem.products as any[])[0]
      : (orderItem.products as any);

    if (!product?.seller_id) {
      throw new Error("Could not verify seller for this order");
    }

    if (product.seller_id !== user.id) {
      throw new Error("Unauthorized: You are not the seller of this order");
    }

    // Update order status and optionally notes (e.g. tracking number)
    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    if (notes) {
      updateData.notes = notes;
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Called by the seller to confirm they have received COD cash payment
 * upon delivery of the order.
 */
export async function markCodPaidAction(orderId: string) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Verify this is a COD order and the caller is the seller
    const { data: orderItem, error: orderItemError } = await supabase
      .from("order_items")
      .select("product_id, products(seller_id)")
      .eq("order_id", orderId)
      .limit(1)
      .single();

    if (orderItemError || !orderItem) {
      throw new Error("Order not found");
    }

    const product: any = Array.isArray(orderItem.products)
      ? (orderItem.products as any[])[0]
      : (orderItem.products as any);

    if (!product?.seller_id || product.seller_id !== user.id) {
      throw new Error("Unauthorized: You are not the seller of this order");
    }

    // Mark payment as paid for COD orders
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq("id", orderId)
      .eq("payment_method", "cod");

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Failed to mark COD as paid:", error);
    return { success: false, error: error.message };
  }
}
