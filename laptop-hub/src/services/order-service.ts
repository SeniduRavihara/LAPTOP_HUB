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
            () => supabase
                    .from("order_items")
                    .select(`
                        *,
                        products!inner(name, seller_id),
                        orders!inner(id, created_at, status, payment_status, total_amount, customer_id, shipping_address)
                    `)
                    .eq("products.seller_id", sellerId)
                    .order("created_at", { ascending: false })
                    .then(({ data, error }: any) => {
                        if (error) throw error;
                        return data;
                    }),
            60000,
            "Request timed out"
        );
    }

    /**
     * Fetches all orders for a specific customer
     */
    static async getUserOrders(supabase: any, userId: string) {
        return withTimeout(
            () => supabase
                    .from("orders")
                    .select(`
                        id, created_at, status, payment_status, total_amount, customer_id, shipping_address,
                        order_items(*, products(name))
                    `)
                    .eq("customer_id", userId)
                    .order("created_at", { ascending: false })
                    .then(({ data, error }: any) => {
                        if (error) throw error;
                        return data;
                    }),
            60000,
            "Request timed out"
        );
    }

    /**
     * Updates an order's status (Admin/Seller functionality)
     */
    static async updateOrderStatus(supabase: any, orderId: string, status: string) {
        return withTimeout(
            () => supabase
                    .from("orders")
                    .update({ status })
                    .eq("id", orderId)
                    .select()
                    .single()
                    .then(({ data, error }: any) => {
                        if (error) throw error;
                        return data;
                    }),
            20000,
            "Update timed out"
        );
    }

    /**
     * Creates a new order with order items
     */
    static async createOrder(supabase: any, orderData: any, items: any[]) {
        return withTimeout(
            async () => {
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
            },
            30000,
            "Order creation timed out"
        );
    }
}
