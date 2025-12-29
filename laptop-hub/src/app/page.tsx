import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { Navbar } from "@/components/navbar";
import Link from "next/link";

const featuredProducts = [
  {
    id: "1",
    name: 'Dell XPS 13 Plus Laptop - 13.4" FHD Display, Intel Core i7, 16GB RAM',
    brand: "Dell",
    price: 1299,
    image: "/dell-xps-13-laptop.jpg",
    rating: 4.8,
    reviews: 328,
    stock: 5,
    badge: "Best Seller",
  },
  {
    id: "2",
    name: 'HP Pavilion 15 Laptop - 15.6" HD Display, AMD Ryzen 5, 8GB RAM',
    brand: "HP",
    price: 549,
    image: "/hp-pavilion-laptop.jpg",
    rating: 4.5,
    reviews: 156,
    stock: 12,
  },
  {
    id: "3",
    name: 'MacBook Air M2 - 13.6" Retina Display, 8-core GPU, 256GB SSD',
    brand: "Apple",
    price: 1199,
    image: "/macbook-air-m2.png",
    rating: 4.9,
    reviews: 412,
    stock: 3,
    badge: "New",
  },
  {
    id: "4",
    name: 'Lenovo ThinkPad E14 Gen 5 - 14" FHD, Intel Core i5, 16GB RAM',
    brand: "Lenovo",
    price: 699,
    image: "/lenovo-thinkpad.png",
    rating: 4.6,
    reviews: 203,
    stock: 8,
  },
  {
    id: "5",
    name: 'ASUS ROG Gaming Laptop - 15.6" 165Hz, RTX 4060, Intel i7-12K',
    brand: "ASUS",
    price: 1599,
    image: "/asus-rog-gaming-laptop.jpg",
    rating: 4.7,
    reviews: 289,
    stock: 6,
    badge: "Hot Deal",
  },
  {
    id: "6",
    name: 'Microsoft Surface Laptop 5 - 13.5" Touch, Intel Core i5, 8GB RAM',
    brand: "Microsoft",
    price: 999,
    image: "/microsoft-surface-laptop.jpg",
    rating: 4.4,
    reviews: 127,
    stock: 0,
  },
  {
    id: "7",
    name: 'MSI GF63 Thin Gaming Laptop - 15.6" 144Hz, RTX 4050, Ryzen 7',
    brand: "MSI",
    price: 899,
    image: "/msi-gaming-laptop.jpg",
    rating: 4.5,
    reviews: 178,
    stock: 10,
  },
  {
    id: "8",
    name: 'Acer Aspire 5 Laptop - 15.6" FHD, Intel Core i5, 16GB RAM',
    brand: "Acer",
    price: 599,
    image: "/acer-aspire-laptop.jpg",
    rating: 4.3,
    reviews: 95,
    stock: 14,
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Premium Laptops at Unbeatable Prices
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Discover the latest laptops from top brands. Compare, bid, and
                buy with confidence.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/auctions"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Explore Auctions
                </Link>
                <Link
                  href="#products"
                  className="border border-primary text-primary hover:bg-primary/5 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Browse Now
                </Link>
              </div>
            </div>
            <div className="flex-1 hidden md:flex justify-end">
              <div className="w-full max-w-md h-64 bg-secondary rounded-lg flex items-center justify-center">
                <svg
                  className="w-32 h-32 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 3v2m6-2v2M9 5h6m-6 4h12M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  All Laptops
                </h2>
                <p className="text-sm text-muted-foreground">
                  Showing {featuredProducts.length} products
                </p>
              </div>
              <select className="border border-border bg-background rounded-lg px-4 py-2 text-sm text-foreground cursor-pointer">
                <option>Most Popular</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Rating</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">About LaptopHub</h3>
              <p className="text-sm opacity-80">
                Your premier destination for laptop sales and auctions
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link
                    href="#"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Browse Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auctions"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Auctions
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Sell with Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link
                    href="#"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:opacity-100 transition-opacity"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link
                    href="#"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2025 LaptopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}
