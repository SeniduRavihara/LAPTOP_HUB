"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"

interface DownloadButtonProps {
  stats: {
    totalRevenue: number
    activeAuctions: number
    pendingOrders: number
    totalUsers: number
    activeProducts: number
  }
  monthlyRevenue: Array<{
    name: string
    total: number
  }>
  recentOrders: Array<{
    id: string
    customer_name: string | null
    customer_email: string | null
    total_amount: number
    status: string
    created_at: string
  }>
}

export function DownloadButton({ stats, monthlyRevenue, recentOrders }: DownloadButtonProps) {
  const handleDownload = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,"

      // Title
      csvContent += "LAPTOP HUB - ADMIN DASHBOARD REPORT\n"
      csvContent += `Generated At,${new Date().toLocaleString()}\n\n`

      // Section 1: Overview Stats
      csvContent += "OVERVIEW STATS\n"
      csvContent += "Metric,Value\n"
      csvContent += `Total Revenue (LKR),${stats.totalRevenue}\n`
      csvContent += `Active Auctions,${stats.activeAuctions}\n`
      csvContent += `Pending Orders,${stats.pendingOrders}\n`
      csvContent += `Total Users,${stats.totalUsers}\n`
      csvContent += `Active Products,${stats.activeProducts}\n\n`

      // Section 2: Monthly Revenue
      csvContent += "MONTHLY REVENUE (LKR)\n"
      csvContent += "Month,Revenue\n"
      monthlyRevenue.forEach((row) => {
        csvContent += `${row.name},${row.total}\n`
      })
      csvContent += "\n"

      // Section 3: Recent Orders
      csvContent += "RECENT ORDERS\n"
      csvContent += "Order ID,Customer Name,Customer Email,Total Amount (LKR),Status,Date\n"
      recentOrders.forEach((order) => {
        const name = order.customer_name ? `"${order.customer_name.replace(/"/g, '""')}"` : "N/A"
        const email = order.customer_email || "N/A"
        const status = order.status
        const date = new Date(order.created_at).toLocaleString()
        csvContent += `${order.id},${name},${email},${order.total_amount},${status},${date}\n`
      })

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `dashboard_report_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("Dashboard report downloaded successfully!")
    } catch (error) {
      console.error("Failed to generate report:", error)
      toast.error("Failed to generate report")
    }
  }

  return (
    <Button onClick={handleDownload} className="flex items-center gap-2">
      <Download className="w-4 h-4" />
      Download Report
    </Button>
  )
}
