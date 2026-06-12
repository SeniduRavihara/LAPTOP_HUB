import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AuthService } from "@/services/auth-service"
import { ProfileService } from "@/services/profile-service"
import { ProfileClient } from "./profile-client"
import { Suspense } from "react"

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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Loading profile...</div>}>
      <ProfileClient user={user} userData={userData} stats={stats} />
    </Suspense>
  )
}
