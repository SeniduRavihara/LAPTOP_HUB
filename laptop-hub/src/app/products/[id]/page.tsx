import { ProductDetailPage } from "@/components/product-detail-page";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ProductService } from "@/services/product-service";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const product = await ProductService.getProductById(supabase, id);

  if (!product) {
    notFound();
  }

  // If the product is currently an active auction, redirect to the auction page
  const auction = Array.isArray(product.auctions) ? product.auctions[0] : product.auctions;
  if (auction && auction.status === 'active') {
    redirect(`/auctions/${auction.id}`);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
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
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>

        <ProductDetailPage product={product} />
      </main>
      <Footer />
    </>
  );
}
