import { withTimeout } from "@/lib/utils/timeout";

export class AuctionService {
    static async getActiveAuctions(supabase: any, limit: number = 10) {
        return withTimeout(
            async () => {
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
                    console.error("Supabase error in getActiveAuctions:", error);
                    throw error;
                }
                
                if (!data || data.length === 0) {
                    console.log("No active auctions found in database.");
                } else {
                    console.log(`Successfully fetched ${data.length} active auctions.`);
                    // Diagnostic: check if products are null
                    const missingProducts = data.filter((a: any) => !a.products).length;
                    if (missingProducts > 0) {
                        console.warn(`${missingProducts} auctions are missing associated product data!`);
                    }
                }
                
                return data;
            },
            60000,
            "Request timed out"
        );
    }

    static async getSellerAuctions(supabase: any, sellerId: string) {
        return withTimeout(
            () => supabase
                    .from("auctions")
                    .select(`
                        *,
                        products(*)
                    `)
                    .eq("seller_id", sellerId)
                    .order("created_at", { ascending: false })
                    .then(({ data, error }: any) => {
                        if (error) throw error;
                        return data;
                    }),
            60000,
            "Request timed out"
        );
    }

    static async getAuctionById(supabase: any, id: string) {
        return withTimeout(
            () => supabase
                    .from("auctions")
                    .select(`
                        *,
                        products(*),
                        bids(*)
                    `)
                    .eq("id", id)
                    .single()
                    .then(({ data, error }: any) => {
                        if (error) throw error;
                        return data;
                    }),
            60000,
            "Request timed out"
        );
    }

    static async placeBid(supabase: any, auctionId: string, userId: string, amount: number) {
        return withTimeout(
            () => supabase
                    .from("bids")
                    .insert({
                        auction_id: auctionId,
                        bidder_id: userId,
                        amount,
                    })
                    .select()
                    .single()
                    .then(({ data, error }: any) => {
                        if (error) throw error;
                        return data;
                    }),
            30000,
            "Placing bid timed out. Please try again."
        );
    }

    static async createAuction(supabase: any, auction: any) {
        return withTimeout(
            () => supabase
                    .from("auctions")
                    .insert(auction)
                    .select()
                    .single()
                    .then(({ data, error }: any) => {
                        if (error) throw error;
                        return data;
                    }),
            30000,
            "Creating auction timed out."
        );
    }

    static async updateAuction(supabase: any, id: string, auction: any) {
        return withTimeout(
            () => supabase
                    .from("auctions")
                    .update(auction)
                    .eq("id", id)
                    .select()
                    .single()
                    .then(({ data, error }: any) => {
                        if (error) throw error;
                        return data;
                    }),
            30000,
            "Updating auction timed out."
        );
    }

    static async cancelAuction(supabase: any, id: string) {
        return withTimeout(
            () => supabase
                    .from("auctions")
                    .update({ status: "cancelled" })
                    .eq("id", id)
                    .then(({ error }: any) => {
                        if (error) throw error;
                    }),
            20000,
            "Cancelling auction timed out."
        );
    }
}
