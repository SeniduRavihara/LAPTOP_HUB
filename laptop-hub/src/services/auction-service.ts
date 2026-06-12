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
     * Create a new auction
     */
    static async createAuction(auction: any, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from("auctions")
                .insert(auction)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('AuctionService.createAuction error:', error);
            throw error;
        }
    }

    /**
     * Update an existing auction
     */
    static async updateAuction(id: string, updates: any, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from("auctions")
                .update(updates)
                .eq("id", id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('AuctionService.updateAuction error:', error);
            throw error;
        }
    }

    /**
     * Cancel an auction
     */
    static async cancelAuction(id: string, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from("auctions")
                .update({ status: "cancelled" })
                .eq("id", id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('AuctionService.cancelAuction error:', error);
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

    /**
     * Close an auction, determine the winner, and create a pending order.
     */
    static async closeAuction(id: string, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            // Get auction and bids to find winner
            const auction = await this.getAuctionById(id, supabase);
            if (!auction) throw new Error("Auction not found");
            
            if (auction.status !== "active") {
                 throw new Error("Auction is already closed");
            }

            let winnerId = null;
            let winningBidAmount = auction.starting_bid;
            
            if (auction.bids && auction.bids.length > 0) {
                 const highestBid = auction.bids.reduce((prev: any, current: any) => (prev.amount > current.amount) ? prev : current);
                 winnerId = highestBid.bidder_id;
                 winningBidAmount = highestBid.amount;
            }

            // End the auction
            const { data: updatedAuction, error: updateError } = await supabase
                .from("auctions")
                .update({ status: "completed" })
                .eq("id", id)
                .select()
                .single();
            
            if (updateError) throw updateError;

            // If there's a winner, create a pending order
            if (winnerId) {
                // Fetch winner user details
                const { data: userData } = await supabase.from('users').select('*').eq('id', winnerId).single();
                
                const orderReference = `ORD-AUC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

                const orderData = {
                    customer_id: winnerId,
                    customer_email: userData?.email || '',
                    customer_name: userData?.name || 'Auction Winner',
                    shipping_address: {
                        address: "Address Pending (Auction Won)",
                        city: "Pending",
                        postalCode: "Pending"
                    },
                    contact_phone: "Pending",
                    total_amount: winningBidAmount,
                    status: 'pending',
                    payment_method: 'online',
                    payment_status: 'pending',
                    payment_reference: orderReference
                };

                const orderItems = [{
                    id: auction.product_id,
                    quantity: 1,
                    price: winningBidAmount
                }];
                
                const { OrderService } = await import('@/services/order-service');
                try {
                    await OrderService.createOrder(orderData, orderItems, supabase);

                    // Update product stock to 0 since it is sold
                    await supabase
                        .from("products")
                        .update({ stock: 0 })
                        .eq("id", auction.product_id);
                } catch(err) {
                    console.error("Failed to create pending order for auction winner:", err);
                }
            }

            return updatedAuction;
        } catch (error) {
            console.error('AuctionService.closeAuction error:', error);
            throw error;
        }
    }
}
