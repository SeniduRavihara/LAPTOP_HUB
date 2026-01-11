import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Download, FileText, TrendingUp, Users } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales Report</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <div className="text-sm text-muted-foreground mb-4">Monthly revenue and taxation summary.</div>
                <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Activity</CardTitle>
                 <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <div className="text-sm text-muted-foreground mb-4">New registrations and active users.</div>
                <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Download CSV
                </Button>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-sm text-muted-foreground mb-4">Current stock levels and low stock alerts.</div>
                 <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Download CSV
                </Button>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
