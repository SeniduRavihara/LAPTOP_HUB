import { SellerSidebar } from '@/components/seller-sidebar'

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full bg-background">
      <SellerSidebar />
      <main className="flex-1 overflow-y-auto pl-64">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
