import { supabase as browserClient } from "@/lib/supabase/client";

export class DashboardService {
  private static getClient(supabaseOverride?: any) {
    return supabaseOverride || browserClient;
  }

  static async getOverviewStats(supabaseOverride?: any) {
    const supabase = this.getClient(supabaseOverride);
    
    try {
      // Get Total Revenue
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("total_amount")
        .in("status", ["confirmed", "processing", "shipped", "delivered"]);
        
      if (ordersError) throw ordersError;
      
      const totalRevenue = (orders || []).reduce((sum: number, order: any) => sum + Number(order.total_amount), 0);
      
      // Get Active Auctions
      const { count: activeAuctionsCount, error: auctionsError } = await supabase
        .from("auctions")
        .select("*", { count: 'exact', head: true })
        .eq("status", "active");
        
      if (auctionsError) throw auctionsError;

      // Get Pending Orders Count
      const { count: pendingOrdersCount, error: pendingError } = await supabase
        .from("orders")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending");

      if (pendingError) throw pendingError;

      // Get Total Users
      const { count: totalUsersCount, error: usersError } = await supabase
        .from("users")
        .select("*", { count: 'exact', head: true });

      if (usersError) throw usersError;

      return {
        totalRevenue,
        activeAuctions: activeAuctionsCount || 0,
        pendingOrders: pendingOrdersCount || 0,
        totalUsers: totalUsersCount || 0
      };
    } catch (error) {
      console.error("DashboardService.getOverviewStats error:", error);
      throw error;
    }
  }

  static async getRecentOrders(limit: number = 5, supabaseOverride?: any) {
    const supabase = this.getClient(supabaseOverride);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          total_amount,
          status,
          created_at,
          customer_name
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("DashboardService.getRecentOrders error:", error);
      throw error;
    }
  }
}
