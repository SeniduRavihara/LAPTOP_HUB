"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Activity, AlertCircle, DollarSign, Gavel, ShoppingBag, Users } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "12,584", change: "+12.5%", icon: <Users className="w-6 h-6" /> },
    {
      label: "Active Sellers",
      value: "1,247",
      change: "+8.2%",
      icon: <ShoppingBag className="w-6 h-6" />,
    },
    { label: "Revenue", value: "$2.8M", change: "+23.1%", icon: <DollarSign className="w-6 h-6" /> },
    { label: "Active Auctions", value: "342", change: "+15.3%", icon: <Gavel className="w-6 h-6" /> },
  ];

  const recentActivity = [
    {
      type: "user",
      message: "New user registered: john@example.com",
      time: "2 minutes ago",
    },
    {
      type: "seller",
      message: "Seller application pending: TechPro Store",
      time: "15 minutes ago",
    },
    {
      type: "report",
      message: "Product reported: Dell XPS 15 - Fake listing",
      time: "1 hour ago",
    },
    {
      type: "auction",
      message: "High-value auction ending soon: MacBook Pro M3",
      time: "2 hours ago",
    },
  ];

  const topSellers = [
    { name: "TechHub Pro", sales: "$124K", orders: 234, rating: 4.8 },
    { name: "LaptopWorld", sales: "$98K", orders: 187, rating: 4.7 },
    { name: "EliteGear", sales: "$87K", orders: 156, rating: 4.9 },
    { name: "ComputerBazaar", sales: "$76K", orders: 142, rating: 4.6 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="w-5 h-5 text-blue-500" />;
      case 'seller': return <ShoppingBag className="w-5 h-5 text-green-500" />;
      case 'report': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'auction': return <Gavel className="w-5 h-5 text-yellow-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your e-commerce platform
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activity Feed */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    System Activity
                  </h2>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Sellers */}
            <div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Top Sellers
                </h2>
                <div className="space-y-4">
                  {topSellers.map((seller, idx) => (
                    <div
                      key={idx}
                      className="pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-foreground">
                          {seller.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-sm text-muted-foreground">
                            {seller.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {seller.orders} orders
                        </span>
                        <span className="font-semibold text-primary">
                          {seller.sales}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
