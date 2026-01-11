import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function ModerationPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Content Moderation</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <Card>
            <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
                <CardDescription>User reviews waiting for approval</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">0</div>
                <Button className="mt-4 w-full" variant="outline">View Queue</Button>
            </CardContent>
         </Card>
         <Card>
            <CardHeader>
                <CardTitle>Reported Products</CardTitle>
                <CardDescription>Products flagged by users</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">0</div>
                 <Button className="mt-4 w-full" variant="outline">View Queue</Button>
            </CardContent>
         </Card>
         <Card>
            <CardHeader>
                <CardTitle>User Reports</CardTitle>
                <CardDescription>Reports against users</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">0</div>
                 <Button className="mt-4 w-full" variant="outline">View Queue</Button>
            </CardContent>
         </Card>
      </div>
      
      <div className="flex items-center justify-center p-8 text-muted-foreground border rounded-md border-dashed">
         No items currently pending moderation.
      </div>
    </div>
  )
}
