'use client'

import {
    BarChart3,
    FileText,
    Flag,
    Gavel,
    LayoutDashboard,
    Package,
    Settings,
    ShoppingCart,
    Store,
    Users,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from './providers/sidebar-provider'

export function AdminSidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useSidebar()

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Sellers', href: '/admin/sellers', icon: Store },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Auctions', href: '/admin/auctions', icon: Gavel },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Content Moderation', href: '/admin/moderation', icon: Flag },
    { label: 'Reports', href: '/admin/reports', icon: FileText },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'System Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <aside className={`bg-sidebar border-r border-sidebar-border h-screen fixed left-0 top-0 overflow-hidden flex flex-col transition-all duration-300 z-20 select-none ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 border-b border-sidebar-border bg-sidebar/50 backdrop-blur-sm z-10 flex items-center justify-between cursor-default">
        {/* Admin Header - Compact */}
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-sidebar-primary-foreground font-bold">A</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sidebar-foreground text-sm truncate">Admin Panel</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">System Control</p>
          </div>
        </div>
        
        <button 
          onClick={toggle}
          className={`p-2 rounded-lg hover:bg-sidebar-accent/10 text-sidebar-foreground transition-all duration-300 relative z-30 cursor-pointer active:scale-95 ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5 pointer-events-none" /> : <ChevronLeft className="w-5 h-5 pointer-events-none" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-custom p-4">

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (
              item.href !== '/admin/dashboard' && 
              pathname.startsWith(item.href) && 
              !menuItems.some(m => m.href !== item.href && pathname.startsWith(m.href) && m.href.length > item.href.length)
            )
            const Icon = item.icon
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
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`} />
                {!isCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
