'use client'

import { LogOut, ChevronLeft, ChevronRight, LayoutDashboard, Box, Plus, Gavel, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSidebar } from './providers/sidebar-provider'
import { AuthService } from '@/services/auth-service'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SellerSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isCollapsed, toggle } = useSidebar()
  const { user } = useAuth()

  const menuItems = [
    { label: 'Dashboard', href: '/seller/dashboard', icon: 'grid' },
    { label: 'My Products', href: '/seller/products', icon: 'box' },
    { label: 'Add Product', href: '/seller/products/new', icon: 'plus' },
    { label: 'My Auctions', href: '/seller/auctions', icon: 'gavel' },
    { label: 'Orders', href: '/seller/orders', icon: 'shopping' },
    // { label: 'Messages', href: '/seller/messages', icon: 'message' },
    // { label: 'Analytics', href: '/seller/analytics', icon: 'chart' },
    // { label: 'Store Settings', href: '/seller/settings', icon: 'settings' },
  ]

  const handleLogout = async () => {
    await AuthService.signOut()
    router.push('/login')
    router.refresh()
  }

  const getIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      grid: <LayoutDashboard className="w-5 h-5" />,
      box: <Box className="w-5 h-5" />,
      plus: <Plus className="w-5 h-5" />,
      gavel: <Gavel className="w-5 h-5" />,
      shopping: <ShoppingBag className="w-5 h-5" />,
      // ... keep existing message, chart, settings if needed
    }
    return icons[icon] || null
  }

  return (
    <aside className={`bg-sidebar border-r border-sidebar-border h-screen fixed left-0 top-0 overflow-hidden flex flex-col transition-all duration-300 z-20 select-none ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 border-b border-sidebar-border bg-sidebar/50 backdrop-blur-sm z-10 flex items-center justify-between cursor-default">
        {/* Store Header - Compact */}
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          <Avatar className="w-10 h-10 border border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground font-bold flex-shrink-0">
            <AvatarImage src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture} />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-bold">
              {(user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "S").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-bold text-sidebar-foreground text-sm truncate">{user?.user_metadata?.full_name || user?.user_metadata?.name || "Seller"}'s Store</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Verified Seller</p>
          </div>
        </div>
        
        <button 
          onClick={toggle}
          className={`p-2 rounded-lg hover:bg-sidebar-accent/10 text-sidebar-foreground transition-all duration-300 relative z-30 cursor-pointer active:scale-95 ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5 pointer-events-none" /> : <ChevronLeft className="w-5 h-5 pointer-events-none" />}
        </button>
      </div>

      {/* TODO: Uncomment when public store page is built */}
      {/* {!isCollapsed && (
        <div className="px-4 py-2">
          <Link href={`/store/${user?.id}`} className="text-[10px] text-sidebar-primary hover:underline font-bold uppercase tracking-tight">
            View Public Store
          </Link>
        </div>
      )} */}

      <div className="flex-1 overflow-y-auto scrollbar-custom p-4">

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (
              item.href !== '/seller/dashboard' && 
              pathname.startsWith(item.href) && 
              !menuItems.some(m => m.href !== item.href && pathname.startsWith(m.href) && m.href.length > item.href.length)
            )
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : ''}
                className={`flex items-center rounded-lg transition-all duration-300 group ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
                } ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/10'
                }`}
              >
                <div className={`transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`}>
                  {getIcon(item.icon)}
                </div>
                {!isCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
      
      {/* Logout Button */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : ''}
          className={`flex items-center transition-all duration-300 text-red-600 hover:bg-red-50 w-full rounded-lg ${
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
