import { createClient } from "@/lib/supabase/server"
import { UsersClient } from "./users-client"

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[UsersPage] Error fetching data:", error)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>

      <UsersClient initialUsers={users || []} />
    </div>
  )
}
