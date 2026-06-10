import { supabase as browserClient } from "@/lib/supabase/client";

export interface MonthlyRevenue {
  name: string;
  total: number;
}

export interface RecentOrder {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  total_amount: number;
  status: string;
  created_at: string;
}

export class DashboardService {
  private static getClient(supabaseOverride?: any) {
    return supabaseOverride || browserClient;
  }

  static async getOverviewStats(supabaseOverride?: any) {
    const supabase = this.getClient(supabaseOverride);
    try {
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("total_amount")
        .in("status", ["confirmed", "processing", "shipped", "delivered"]);

      if (ordersError) throw ordersError;

      const totalRevenue = (orders || []).reduce((sum: number, order: any) => sum + Number(order.total_amount), 0);

      const { count: activeAuctionsCount, error: auctionsError } = await supabase
        .from("auctions")
        .select("*", { count: 'exact', head: true })
        .eq("status", "active");

      if (auctionsError) throw auctionsError;

      const { count: pendingOrdersCount, error: pendingError } = await supabase
        .from("orders")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending");

      if (pendingError) throw pendingError;

      const { count: totalUsersCount, error: usersError } = await supabase
        .from("users")
        .select("*", { count: 'exact', head: true });

      if (usersError) throw usersError;

      const { count: activeProductsCount, error: productsError } = await supabase
        .from("products")
        .select("*", { count: 'exact', head: true })
        .gt("stock", 0);

      if (productsError) throw productsError;

      return {
        totalRevenue,
        activeAuctions: activeAuctionsCount || 0,
        pendingOrders: pendingOrdersCount || 0,
        totalUsers: totalUsersCount || 0,
        activeProducts: activeProductsCount || 0
      };
    } catch (error) {
      console.error("DashboardService.getOverviewStats error:", error);
      throw error;
    }
  }

  static async getSellerOverviewStats(sellerId: string, supabaseOverride?: any) {
    const supabase = this.getClient(supabaseOverride);

    try {
      const { data: products } = await supabase
        .from("products")
        .select("id")
        .eq("seller_id", sellerId);

      const productIds = (products || []).map((p: any) => p.id);

      if (productIds.length === 0) {
        return {
          totalRevenue: 0,
          activeAuctions: 0,
          pendingOrders: 0,
          activeProducts: 0,
        };
      }

      const { data: revenueItems } = await supabase
        .from("order_items")
        .select("total_price, orders!inner(status)")
        .in("product_id", productIds)
        .in("orders.status", ["confirmed", "processing", "shipped", "delivered"]);

      const totalRevenue = (revenueItems || []).reduce(
        (sum: number, item: any) => sum + Number(item.total_price),
        0
      );

      const { data: pendingItems } = await supabase
        .from("order_items")
        .select("order_id, orders!inner(status)")
        .in("product_id", productIds)
        .eq("orders.status", "pending");

      const pendingOrderIds = new Set(
        (pendingItems || []).map((i: any) => i.order_id)
      );

      const { count: activeProductsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", sellerId)
        .gt("stock", 0);

      const { count: activeAuctionsCount } = await supabase
        .from("auctions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .eq("seller_id", sellerId);

      return {
        totalRevenue,
        activeAuctions: activeAuctionsCount || 0,
        pendingOrders: pendingOrderIds.size,
        activeProducts: activeProductsCount || 0,
      };
    } catch (error) {
      console.error("DashboardService.getSellerOverviewStats error:", error);
      throw error;
    }
  }

  static async getMonthlyRevenue(sellerId: string, supabaseOverride?: any) {
    const supabase = this.getClient(supabaseOverride);

    try {
      const { data: products } = await supabase
        .from("products")
        .select("id")
        .eq("seller_id", sellerId);

      const productIds = (products || []).map((p: any) => p.id);

      if (productIds.length === 0) {
        return [];
      }

      const { data: items } = await supabase
        .from("order_items")
        .select("total_price, created_at, orders!inner(status)")
        .in("product_id", productIds)
        .in("orders.status", ["confirmed", "processing", "shipped", "delivered"]);

      if (!items) return [];

      const monthMap = new Map<string, number>();
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      for (const item of items) {
        const date = new Date(item.created_at);
        const monthName = months[date.getMonth()];
        monthMap.set(
          monthName,
          (monthMap.get(monthName) || 0) + Number(item.total_price)
        );
      }

      return months.map((name) => ({
        name,
        total: monthMap.get(name) || 0,
      }));
    } catch (error) {
      console.error("DashboardService.getMonthlyRevenue error:", error);
      throw error;
    }
  }

  static async getRecentOrders(
    sellerId: string,
    limit: number = 5,
    supabaseOverride?: any
  ) {
    const supabase = this.getClient(supabaseOverride);

    try {
      const { data: products } = await supabase
        .from("products")
        .select("id")
        .eq("seller_id", sellerId);

      const productIds = (products || []).map((p: any) => p.id);

      if (productIds.length === 0) {
        return [];
      }

      const { data: items } = await supabase
        .from("order_items")
        .select(
          "total_price, orders!inner(id, customer_name, customer_email, total_amount, status, created_at)"
        )
        .in("product_id", productIds)
        .order("created_at", { ascending: false })
        .limit(limit);

      const orderMap = new Map<string, RecentOrder>();
      for (const item of items || []) {
        const order = item.orders;
        if (!orderMap.has(order.id)) {
          orderMap.set(order.id, {
            id: order.id,
            customer_name: order.customer_name,
            customer_email: order.customer_email,
            total_amount: Number(item.total_price),
            status: order.status,
            created_at: order.created_at,
          });
        } else {
          const existing = orderMap.get(order.id)!;
          existing.total_amount += Number(item.total_price);
        }
      }

      return Array.from(orderMap.values()).slice(0, limit);
    } catch (error) {
      console.error("DashboardService.getRecentOrders error:", error);
      throw error;
    }
  }

  static async getAdminMonthlyRevenue(supabaseOverride?: any) {
    const supabase = this.getClient(supabaseOverride);

    try {
      const { data: items, error } = await supabase
        .from("order_items")
        .select("total_price, created_at, orders!inner(status)")
        .in("orders.status", ["confirmed", "processing", "shipped", "delivered"]);

      if (error) throw error;
      if (!items) return [];

      const monthMap = new Map<string, number>();
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      for (const item of items) {
        const date = new Date(item.created_at);
        const monthName = months[date.getMonth()];
        monthMap.set(
          monthName,
          (monthMap.get(monthName) || 0) + Number(item.total_price)
        );
      }

      return months.map((name) => ({
        name,
        total: monthMap.get(name) || 0,
      }));
    } catch (error) {
      console.error("DashboardService.getAdminMonthlyRevenue error:", error);
      throw error;
    }
  }

  static async getAdminRecentOrders(
    limit: number = 5,
    supabaseOverride?: any
  ) {
    const supabase = this.getClient(supabaseOverride);

    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("id, customer_name, customer_email, total_amount, status, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (orders || []).map((order: any) => ({
        id: order.id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        total_amount: Number(order.total_amount),
        status: order.status,
        created_at: order.created_at,
      }));
    } catch (error) {
      console.error("DashboardService.getAdminRecentOrders error:", error);
      throw error;
    }
  }
}
