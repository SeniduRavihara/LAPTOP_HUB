"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, TrendingUp, Users, Gavel } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function ReportsClient() {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const supabase = createClient()

    const downloadCSV = (filename: string, csvData: string) => {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleDownloadSales = async () => {
        setIsLoading('sales')
        try {
            const { data, error } = await supabase.from('orders').select('id, user_id, total, status, created_at')
            if (error) throw error
            if (!data || data.length === 0) {
                toast.info("No sales data found")
                return
            }
            
            const headers = ["Order ID", "User ID", "Total Amount", "Status", "Date"]
            const csvRows = [headers.join(",")]
            data.forEach((order: any) => {
                csvRows.push([order.id, order.user_id, order.total, order.status, order.created_at].join(","))
            })
            downloadCSV("sales_report.csv", csvRows.join("\n"))
            toast.success("Sales report downloaded successfully")
        } catch (error: any) {
            toast.error("Failed to generate sales report: " + error.message)
        } finally {
            setIsLoading(null)
        }
    }

    const handleDownloadUsers = async () => {
        setIsLoading('users')
        try {
            const { data, error } = await supabase.from('users').select('id, email, full_name, role, created_at')
            if (error) throw error
            if (!data || data.length === 0) {
                toast.info("No users data found")
                return
            }
            
            const headers = ["User ID", "Email", "Full Name", "Role", "Join Date"]
            const csvRows = [headers.join(",")]
            data.forEach((u: any) => {
                csvRows.push([u.id, u.email, `"${u.full_name || ''}"`, u.role, u.created_at].join(","))
            })
            downloadCSV("users_report.csv", csvRows.join("\n"))
            toast.success("Users report downloaded successfully")
        } catch (error: any) {
            toast.error("Failed to generate users report: " + error.message)
        } finally {
            setIsLoading(null)
        }
    }

    const handleDownloadAuctions = async () => {
        setIsLoading('auctions')
        try {
            const { data, error } = await supabase.from('auctions').select('id, product_id, starting_bid, start_time, end_time, status, created_at')
            if (error) throw error
            if (!data || data.length === 0) {
                toast.info("No auctions data found")
                return
            }
            
            const headers = ["Auction ID", "Product ID", "Starting Bid", "Status", "Start Time", "End Time"]
            const csvRows = [headers.join(",")]
            data.forEach((a: any) => {
                csvRows.push([a.id, a.product_id, a.starting_bid, a.status, a.start_time, a.end_time].join(","))
            })
            downloadCSV("auctions_report.csv", csvRows.join("\n"))
            toast.success("Auctions report downloaded successfully")
        } catch (error: any) {
            toast.error("Failed to generate auctions report: " + error.message)
        } finally {
            setIsLoading(null)
        }
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales Report</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     <div className="text-sm text-muted-foreground mb-4">Complete order history and revenue data.</div>
                    <Button className="w-full" onClick={handleDownloadSales} disabled={isLoading !== null}>
                        <Download className="mr-2 h-4 w-4" /> {isLoading === 'sales' ? 'Generating...' : 'Download CSV'}
                    </Button>
                </CardContent>
             </Card>
             
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">User Activity</CardTitle>
                     <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     <div className="text-sm text-muted-foreground mb-4">All registered users and roles.</div>
                    <Button className="w-full" variant="outline" onClick={handleDownloadUsers} disabled={isLoading !== null}>
                        <Download className="mr-2 h-4 w-4" /> {isLoading === 'users' ? 'Generating...' : 'Download CSV'}
                    </Button>
                </CardContent>
             </Card>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Auctions Report</CardTitle>
                    <Gavel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">All auctions and their statuses.</div>
                     <Button className="w-full" variant="outline" onClick={handleDownloadAuctions} disabled={isLoading !== null}>
                        <Download className="mr-2 h-4 w-4" /> {isLoading === 'auctions' ? 'Generating...' : 'Download CSV'}
                    </Button>
                </CardContent>
             </Card>
        </div>
    )
}
