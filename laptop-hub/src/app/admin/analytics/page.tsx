import { Overview } from "@/components/admin/overview"
import { DownloadButton } from "@/components/admin/download-button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { DashboardService } from "@/services/dashboard-service"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const stats = await DashboardService.getOverviewStats(supabase)
  const monthlyRevenue = await DashboardService.getAdminMonthlyRevenue(supabase)
  const recentOrders = await DashboardService.getAdminRecentOrders(5, supabase)
  
  // Calculate Average Order Value
  const { count: confirmedOrdersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['confirmed', 'processing', 'shipped', 'delivered']);

  const avgOrderValue = confirmedOrdersCount && confirmedOrdersCount > 0
    ? stats.totalRevenue / confirmedOrdersCount 
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <DownloadButton 
          stats={stats} 
          monthlyRevenue={monthlyRevenue} 
          recentOrders={recentOrders} 
        />
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">LKR {stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Lifetime confirmed sales
                </p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">LKR {Math.round(avgOrderValue).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Across {confirmedOrdersCount || 0} orders
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Auctions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeAuctions}</div>
                <p className="text-xs text-muted-foreground">
                  Currently running auctions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Laptops in stock
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={monthlyRevenue} />
              </CardContent>
            </Card>
        </div>
    </div>
  )
}
