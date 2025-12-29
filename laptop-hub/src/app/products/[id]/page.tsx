import { ProductDetailPage } from "@/components/product-detail-page";

export default function ProductDetail() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">
            Home
          </a>
          <span>/</span>
          <a
            href="/products"
            className="hover:text-foreground transition-colors"
          >
            Products
          </a>
          <span>/</span>
          <span className="text-foreground font-medium">Dell XPS 13 Plus</span>
        </nav>
      </div>

      <ProductDetailPage />
    </div>
  );
}
