import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AuthService } from "@/services/auth-service"
import { ProfileService } from "@/services/profile-service"
import { ProfileClient } from "./profile-client"

export default async function ProfilePage() {
  const supabase = await createClient()
  const user: any = await AuthService.getUser(supabase)

  if (!user) {
    redirect("/login")
  }

  const [userData, stats] = await Promise.all([
    ProfileService.getUserProfile(user.id, supabase),
    ProfileService.getUserStats(user.id, supabase)
  ])

  return (
    <ProfileClient user={user} userData={userData} stats={stats} />
  )
}
