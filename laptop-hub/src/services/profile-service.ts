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
