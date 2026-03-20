"use client"
import { AdminSidebar } from '@/components/admin-sidebar'
import { SidebarProvider, useSidebar } from '@/components/providers/sidebar-provider'

function AdminMain({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  return (
    <main className={`flex-1 overflow-y-auto scrollbar-custom transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-64'}`}>
      <div className="container mx-auto p-8">
        {children}
      </div>
    </main>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="fixed inset-0 flex w-full bg-background overflow-hidden">
        <AdminSidebar />
        <AdminMain>{children}</AdminMain>
      </div>
    </SidebarProvider>
  )
}
