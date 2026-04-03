import { supabase as browserClient } from "@/lib/supabase/client";

export class OrderService {
    private static getClient(supabaseOverride?: any) {
        return supabaseOverride || browserClient;
    }

    /**
     * Fetches all orders for the current user
     */
    static async getUserOrders(userId: string, supabaseOverride?: any) {
        const supabase = this.getClient(supabaseOverride);
        try {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("customer_id", userId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('OrderService.getUserOrders error:', error);
            throw error;
        }
    }

    /**
     * Fetches order items for a specific seller
     */
    static async getSellerOrderItems(sellerId: string, supabaseOverride?: any) {
        const supabase = this.getClient(supabaseOverride);
        try {
            const { data, error } = await supabase
                .from("order_items")
                .select("*, products!inner(*), orders!inner(*)")
                .eq("products.seller_id", sellerId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('OrderService.getSellerOrderItems error:', error);
            throw error;
        }
    }

    /**
     * Updates an order status
     */
    static async updateOrderStatus(orderId: string, status: string, supabaseOverride?: any) {
        const supabase = this.getClient(supabaseOverride);
        try {
            const { data, error } = await supabase
                .from("orders")
                .update({ status })
                .eq("id", orderId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('OrderService.updateOrderStatus error:', error);
            throw error;
        }
    }

    /**
     * Creates a new order with order items
     */
    static async createOrder(orderData: any, items: any[], supabaseOverride?: any) {
        const supabase = this.getClient(supabaseOverride);
        try {
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert([orderData])
                .select("*")
                .single();

            if (orderError) throw orderError;

            const orderItems = items.map((item) => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price,
                total_price: item.price * item.quantity,
            }));

            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItems);

            if (itemsError) throw itemsError;

            return order;
        } catch (error) {
            console.error('OrderService.createOrder error:', error);
            throw error;
        }
    }
}
