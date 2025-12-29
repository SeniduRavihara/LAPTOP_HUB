import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductDetailPage } from '@/components/product-detail-page'
import Link from 'next/link'

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-border">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-accent hover:text-accent/80">Home</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/" className="text-accent hover:text-accent/80">Laptops</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Dell XPS 13 Plus</span>
        </div>
      </div>

      <ProductDetailPage />

      {/* Footer */}
      <Footer />
    </main>
  )
}
