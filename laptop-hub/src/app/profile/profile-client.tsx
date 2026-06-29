"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProfileForm } from "@/components/profile/profile-form"
import { ChangePasswordForm } from "@/components/profile/change-password-form"
import { AddressList } from "@/components/profile/address-list"
import { OrderHistory } from "@/components/profile/order-history"
import { MyBids } from "@/components/profile/my-bids"
import { WonAuctions } from "@/components/profile/won-auctions"
import { Wishlist } from "@/components/profile/wishlist"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit2, Store } from "lucide-react"
import { updateUserRole } from "@/app/actions/user"

interface ProfileClientProps {
  user: any
  userData: any
  stats: any
}

export function ProfileClient({ user, userData, stats }: ProfileClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  
  const [activeTab, setActiveTab] = useState("profile")

  // Sync activeTab with URL tab parameter on mount and parameter changes
  useEffect(() => {
    const validTabs = ["profile", "orders", "won-auctions", "addresses", "security", "wishlist"]
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam)
    } else if (!tabParam) {
      setActiveTab("profile")
    }
  }, [tabParam])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`/profile?tab=${tab}`, { scroll: false })
  }

  const initials = userData?.name
    ? userData.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* User Info Card */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <Avatar className="h-24 w-24 border-4 border-muted">
                    <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-foreground mb-1">{userData?.name || "User"}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form Section */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">Manage your basic details.</p>
                </div>
                <ProfileForm user={user} userData={userData} />
              </CardContent>
            </Card>

            {/* Stats Section */}
            <div className="space-y-4">
               <h3 className="text-lg font-semibold px-1">Activity Overview</h3>
               <ProfileStats stats={stats} />
            </div>

            {/* Become a Seller */}
            {user?.user_metadata?.role === 'customer' && (
              <Card className="border-none shadow-sm bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Store className="w-7 h-7 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">Start Selling on LaptopHub</h3>
                      <p className="text-sm text-muted-foreground mt-1">Upgrade to a seller account and start listing your laptops for sale or auction.</p>
                    </div>
                    <Button
                      onClick={async () => {
                        const result = await updateUserRole(user.id, 'seller');
                        if (result.success) {
                          toast.success("You're now a seller! Redirecting...");
                          setTimeout(() => router.push('/seller/dashboard'), 1500);
                        } else {
                          toast.error(result.error || "Failed to upgrade account");
                        }
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 font-semibold cursor-pointer active:scale-[0.98] transition-all flex-shrink-0"
                    >
                      Become a Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )
      case "orders":
        return <OrderHistory userId={user.id} />
      case "won-auctions":
        return <WonAuctions userId={user.id} />
      case "addresses":
        return <AddressList userId={user.id} />
      case "security":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Card className="border-none shadow-sm">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">Keep your account secure with a strong password.</p>
                </div>
                <ChangePasswordForm />
              </CardContent>
            </Card>
          </div>
        )
      case "wishlist":
        return <Wishlist userId={user.id} />
      case "bids":
        return <MyBids userId={user.id} />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 flex w-full bg-background overflow-hidden">
      <ProfileSidebar 
        user={{ name: userData?.name, email: user.email }} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      <main className="flex-1 overflow-y-auto scrollbar-custom pl-64">
        <div className="container mx-auto p-8 space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-border/50">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">My Account</h1>
              <p className="text-muted-foreground mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          <div className="pt-2">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}
