import { UserRoleSelect } from "@/components/admin/user-role-select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"

export default async function SellersPage() {
  const supabase = await createClient()

  const { data: sellers } = await supabase
    .from("users")
    .select("*")
    .eq("role", "seller")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sellers</h2>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers?.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell>
                  <Avatar>
                    <AvatarFallback>{seller.name?.slice(0, 2).toUpperCase() || "S"}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{seller.name || "Unknown"}</TableCell>
                <TableCell>{seller.rate || "N/A"}</TableCell>
                <TableCell>{new Date(seller.created_at).toLocaleDateString()}</TableCell>
                 <TableCell>
                  <UserRoleSelect userId={seller.id} currentRole={seller.role} />
                </TableCell>
              </TableRow>
            ))}
             {sellers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No sellers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
