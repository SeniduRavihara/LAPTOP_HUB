import { withTimeout } from "@/lib/utils/timeout";

export class AuctionService {
    static async getActiveAuctions(supabase: any) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from("auctions")
                    .select(`
                        *,
                        products!inner(*)
                    `)
                    .eq("status", "active")
                    .order("end_time", { ascending: true });

                if (error) throw error;
                return data;
            })(),
            15000,
            "Request timed out"
        );
    }

    static async getSellerAuctions(supabase: any, sellerId: string) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from("auctions")
                    .select(`
                        *,
                        products!inner(*)
                    `)
                    .eq("seller_id", sellerId)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                return data;
            })(),
            15000,
            "Request timed out"
        );
    }

    static async getAuctionById(supabase: any, id: string) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from("auctions")
                    .select(`
                        *,
                        products!inner(*),
                        bids(*)
                    `)
                    .eq("id", id)
                    .single();

                if (error) throw error;
                return data;
            })(),
            15000,
            "Request timed out"
        );
    }

    static async placeBid(supabase: any, auctionId: string, userId: string, amount: number) {
        return withTimeout(
            (async () => {
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
            })(),
            20000,
            "Placing bid timed out. Please try again."
        );
    }

    static async createAuction(supabase: any, auction: any) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from("auctions")
                    .insert(auction)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            })(),
            20000,
            "Creating auction timed out."
        );
    }

    static async updateAuction(supabase: any, id: string, auction: any) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from("auctions")
                    .update(auction)
                    .eq("id", id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            })(),
            20000,
            "Updating auction timed out."
        );
    }

    static async cancelAuction(supabase: any, id: string) {
        return withTimeout(
            (async () => {
                const { error } = await supabase
                    .from("auctions")
                    .update({ status: "cancelled" })
                    .eq("id", id);

                if (error) throw error;
            })(),
            15000,
            "Cancelling auction timed out."
        );
    }
}
