import { CartPage } from "@/components/cart-page";

export default function Cart() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">
            Home
          </a>
          <span>/</span>
          <span className="text-foreground font-medium">Shopping Cart</span>
        </nav>

        <CartPage />
      </div>
    </div>
  );
}
