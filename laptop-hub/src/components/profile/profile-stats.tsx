"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, PackageOpen, Heart, MapPin } from "lucide-react"

interface ProfileStatsProps {
  stats: {
    totalOrders: number
    activeOrders: number
    wishlistCount: number
    addressCount: number
  }
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-primary/5 text-primary border-primary/10"
    },
    {
      label: "Active Orders",
      value: stats.activeOrders,
      icon: PackageOpen,
      color: "bg-accent/5 text-accent border-accent/10"
    },
    {
      label: "Wishlist",
      value: stats.wishlistCount,
      icon: Heart,
      color: "bg-destructive/5 text-destructive border-destructive/10"
    },
    {
      label: "Addresses",
      value: stats.addressCount,
      icon: MapPin,
      color: "bg-primary/5 text-primary border-primary/10"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.label}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground capitalize">
              Total {stat.label.toLowerCase()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
