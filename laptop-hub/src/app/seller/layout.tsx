"use client"
import { SellerSidebar } from '@/components/seller-sidebar'
import { SidebarProvider, useSidebar } from '@/components/providers/sidebar-provider'

function SellerMain({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  return (
    <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-64'}`}>
      <div className="container mx-auto p-8">
        {children}
      </div>
    </main>
  )
}

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <SellerSidebar />
        <SellerMain>{children}</SellerMain>
      </div>
    </SidebarProvider>
  )
}
