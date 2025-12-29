"use client";

import { SellerSidebar } from "@/components/seller-sidebar";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Package, ShoppingBag, Star } from "lucide-react";

export default function SellerDashboard() {
  const stats = [
    {
      label: "Total Sales",
      value: "$124,584",
      change: "+15.3%",
      icon: <DollarSign className="w-6 h-6" />,
    },
    { 
      label: "Total Orders", 
      value: "234", 
      change: "+8.7%", 
      icon: <ShoppingBag className="w-6 h-6" /> 
    },
    { 
      label: "Products Listed", 
      value: "48", 
      change: "+4", 
      icon: <Package className="w-6 h-6" /> 
    },
    { 
      label: "Seller Rating", 
      value: "4.8", 
      change: "+0.2", 
      icon: <Star className="w-6 h-6" /> 
    },
  ];

  const recentOrders = [
    {
      id: "#12345",
      product: "Dell XPS 13",
      customer: "John Doe",
      amount: "$1,299",
      status: "Delivered",
    },
    {
      id: "#12344",
      product: 'MacBook Pro 14"',
      customer: "Jane Smith",
      amount: "$1,999",
      status: "Shipped",
    },
    {
      id: "#12343",
      product: "ThinkPad X1",
      customer: "Bob Johnson",
      amount: "$1,099",
      status: "Processing",
    },
    {
      id: "#12342",
      product: "ASUS ROG",
      customer: "Alice Brown",
      amount: "$1,599",
      status: "Pending",
    },
  ];

  const topProducts = [
    { name: "Dell XPS 13", sales: 45, revenue: "$58,455" },
    { name: 'MacBook Pro 14"', sales: 32, revenue: "$63,968" },
    { name: "ThinkPad X1 Carbon", sales: 28, revenue: "$30,772" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Shipped":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Processing":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Pending":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Seller Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, TechStore Pro!
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
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    Recent Orders
                  </h2>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-sm font-semibold text-muted-foreground pb-3">
                          Order ID
                        </th>
                        <th className="text-left text-sm font-semibold text-muted-foreground pb-3">
                          Product
                        </th>
                        <th className="text-left text-sm font-semibold text-muted-foreground pb-3">
                          Customer
                        </th>
                        <th className="text-left text-sm font-semibold text-muted-foreground pb-3">
                          Amount
                        </th>
                        <th className="text-left text-sm font-semibold text-muted-foreground pb-3">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="py-4 text-sm font-medium text-foreground">
                            {order.id}
                          </td>
                          <td className="py-4 text-sm text-foreground">
                            {order.product}
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {order.customer}
                          </td>
                          <td className="py-4 text-sm font-semibold text-foreground">
                            {order.amount}
                          </td>
                          <td className="py-4">
                            <Badge
                              className={`${getStatusColor(
                                order.status
                              )} border`}
                            >
                              {order.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Products */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Top Products
                </h2>
                <div className="space-y-4">
                  {topProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <p className="font-semibold text-foreground mb-2">
                        {product.name}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {product.sales} sales
                        </span>
                        <span className="font-semibold text-primary">
                          {product.revenue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    + Add New Product
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    Create Auction
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    View Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
