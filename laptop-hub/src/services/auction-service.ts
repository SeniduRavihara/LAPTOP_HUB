import { supabase as browserClient } from "@/lib/supabase/client";

export class AuctionService {
    /**
     * Get all active auctions with product and bid data
     */
    static async getActiveAuctions(limit: number = 10, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from("auctions")
                .select(`
                    *,
                    products(*),
                    bids(amount)
                `)
                .eq("status", "active")
                .order("end_time", { ascending: true })
                .limit(limit);

            if (error) {
                console.error("AuctionService.getActiveAuctions error:", error);
                throw error;
            }
            
            return data;
        } catch (error) {
            console.error('AuctionService.getActiveAuctions error:', error);
            throw error;
        }
    }

    /**
     * Get all auctions for a specific seller
     */
    static async getSellerAuctions(sellerId: string, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from("auctions")
                .select(`
                    *,
                    products(*)
                `)
                .eq("seller_id", sellerId)
                .order("created_at", { ascending: false });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('AuctionService.getSellerAuctions error:', error);
            throw error;
        }
    }

    /**
     * Get a single auction by ID
     */
    static async getAuctionById(id: string, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from("auctions")
                .select(`
                    *,
                    products(*),
                    bids(*)
                `)
                .eq("id", id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            if ((error as any)?.code === 'PGRST116') {
                return null;
            }
            console.error('AuctionService.getAuctionById error:', error);
            throw error;
        }
    }

    /**
     * Place a new bid on an auction
     */
    static async placeBid(auctionId: string, userId: string, amount: number, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from("bids")
                .insert({
                    auction_id: auctionId,
                    bidder_id: userId,
                    amount,
                })
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('AuctionService.placeBid error:', error);
            throw error;
        }
    }

    /**
     * End an auction (can be called by a trigger or job)
     */
    static async endAuction(id: string, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from("auctions")
                .update({ status: "ended" })
                .eq("id", id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('AuctionService.endAuction error:', error);
            throw error;
        }
    }
}
