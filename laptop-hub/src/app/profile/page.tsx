import { OrderHistory } from "@/components/profile/order-history"
import { ProfileForm } from "@/components/profile/profile-form"
import { AddressList } from "@/components/profile/address-list"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AuthService } from "@/services/auth-service"
import { ProfileService } from "@/services/profile-service"

export default async function ProfilePage() {
  const supabase = await createClient()
  const user: any = await AuthService.getUser(supabase)

  if (!user) {
    redirect("/login")
  }

  const userData = await ProfileService.getUserProfile(supabase, user.id)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto py-10 px-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">My Account</h2>
              <p className="text-muted-foreground">
                Manage your account settings and view order history.
              </p>
            </div>
            <Separator />
            
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                 <div className="flex flex-col gap-6">
                    <div>
                      <h3 className="text-lg font-medium">Personal Information</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your personal details here.
                      </p>
                    </div>
                    <ProfileForm user={user} userData={userData} />
                 </div>
              </TabsContent>

              <TabsContent value="addresses">
                <AddressList userId={user.id} />
              </TabsContent>
              
              <TabsContent value="orders">
                <OrderHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
