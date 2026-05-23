import { supabase as browserClient } from "@/lib/supabase/client";

export class ProfileService {
    /**
     * Get a user's profile data
     */
    static async getUserProfile(userId: string, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            if ((error as any)?.code === 'PGRST116') {
                return null;
            }
            console.error('ProfileService.getUserProfile error:', error);
            throw error;
        }
    }

    /**
     * Update a user's profile
     */
    static async updateProfile(userId: string, updates: any, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('ProfileService.updateProfile error:', error);
            throw error;
        }
    }

    /**
     * Get user statistics for the profile dashboard
     */
    static async getUserStats(userId: string, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const [orders, activeOrders, wishlist, addresses] = await Promise.all([
                supabase.from('orders').select('id', { count: 'exact' }).eq('customer_id', userId),
                supabase.from('orders').select('id', { count: 'exact' }).eq('customer_id', userId).not('status', 'in', '("delivered","cancelled","refunded")'),
                supabase.from('wishlists').select('id', { count: 'exact' }).eq('user_id', userId),
                supabase.from('addresses').select('id', { count: 'exact' }).eq('user_id', userId)
            ]);
            
            return {
                totalOrders: orders.count || 0,
                activeOrders: activeOrders.count || 0,
                wishlistCount: wishlist.count || 0,
                addressCount: addresses.count || 0
            };
        } catch (error) {
            console.error('ProfileService.getUserStats error:', error);
            throw error;
        }
    }

    /**
     * Get seller specific statistics for the dashboard
     */
    static async getSellerStats(sellerId: string, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            // Complex stats can be implemented as a RPC or multiple parallel calls
            const [products, auctions] = await Promise.all([
                supabase.from('products').select('id', { count: 'exact' }).eq('seller_id', sellerId),
                supabase.from('auctions').select('id', { count: 'exact' }).eq('seller_id', sellerId).eq('status', 'active')
            ]);
            
            return {
                totalProducts: products.count || 0,
                activeAuctions: auctions.count || 0
            };
        } catch (error) {
            console.error('ProfileService.getSellerStats error:', error);
            throw error;
        }
    }
}
