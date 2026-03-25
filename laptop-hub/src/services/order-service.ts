import { withTimeout } from "@/lib/utils/timeout";

/**
 * OrderService
 * Handles all order and sales operations using the provided Supabase client.
 * Environment-agnostic: works in both Client and Server components.
 */
export class OrderService {
    /**
     * Fetches order items where the product belongs to a specific seller
     */
    static async getSellerOrderItems(supabase: any, sellerId: string) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from("order_items")
                    .select(`
                        *,
                        products!inner(name, seller_id),
                        orders!inner(id, created_at, status, total_amount, customer_id, shipping_address)
                    `)
                    .eq("products.seller_id", sellerId)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                return data;
            })(),
            15000,
            "Request timed out"
        );
    }

    /**
     * Fetches all orders for a specific customer
     */
    static async getUserOrders(supabase: any, userId: string) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from("orders")
                    .select(`
                        *,
                        order_items(*, products(name))
                    `)
                    .eq("customer_id", userId)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                return data;
            })(),
            15000,
            "Request timed out"
        );
    }

    /**
     * Updates an order's status (Admin/Seller functionality)
     */
    static async updateOrderStatus(supabase: any, orderId: string, status: string) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from("orders")
                    .update({ status })
                    .eq("id", orderId)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            })(),
            15000,
            "Update timed out"
        );
    }
}
