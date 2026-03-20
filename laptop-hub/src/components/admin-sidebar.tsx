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
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminSidebar() {
  const pathname = usePathname()

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
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen fixed left-0 top-0 pt-20 overflow-y-auto">
      <div className="p-4">
        {/* Admin Header */}
        <div className="mb-8 pb-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-sidebar-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sidebar-primary-foreground font-bold text-lg">A</span>
            </div>
            <div>
              <p className="font-semibold text-sidebar-foreground text-sm">Admin Panel</p>
              <p className="text-xs text-sidebar-accent">System Control</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
