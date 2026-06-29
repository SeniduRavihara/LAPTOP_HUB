"use client"

import { cn } from "@/lib/utils"
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Heart, 
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Trophy
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ProfileSidebarProps {
  user: {
    name: string | null
    email: string
  }
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ProfileSidebar({ user, activeTab, onTabChange }: ProfileSidebarProps) {
  const router = useRouter()

  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "won-auctions", label: "Won Auctions", icon: Trophy },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "security", label: "Security", icon: ShieldCheck },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  return (
    <aside className="bg-sidebar border-r border-sidebar-border h-screen fixed left-0 top-0 overflow-hidden flex flex-col transition-all duration-300 z-20 select-none w-64">
      <div className="p-4 border-b border-sidebar-border bg-sidebar/50 backdrop-blur-sm z-10 flex flex-col gap-4">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-sidebar-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          BACK TO HOME
        </Link>
        <div className="flex items-center gap-3 transition-opacity duration-300 pt-2">
          <Avatar className="w-10 h-10 border border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground font-bold flex-shrink-0">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-bold text-sidebar-foreground text-sm truncate">{user.name || "User"}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold truncate max-w-[140px]">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-custom p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center rounded-lg transition-all duration-300 group gap-3 px-4 py-3 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                }`}
              >
                <Icon size={18} className={`flex-shrink-0 transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`} />
                <span className="text-sm font-medium truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/10 px-4 h-11"
        >
          <LogOut size={18} className="mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  )
}
