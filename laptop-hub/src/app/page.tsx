import { ProductCard } from "@/components/product-card";
import { AuctionCard } from "@/components/auction-card";
import { ProductFilters } from "@/components/product-filters";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { ProductService } from "@/services/product-service";
import { AuctionService } from "@/services/auction-service";

export default async function HomePage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  const searchParams = props.searchParams ? await props.searchParams : {};

  const brands = searchParams.brands ? (searchParams.brands as string).split(',') : undefined;
  const processors = searchParams.processors ? (searchParams.processors as string).split(',') : undefined;
  const rams = searchParams.rams ? (searchParams.rams as string).split(',') : undefined;
  const minPrice = searchParams.minPrice as string | undefined;
  const maxPrice = searchParams.maxPrice as string | undefined;

  const hasFilters = brands || processors || rams || minPrice || maxPrice;

  let products;
  if (hasFilters) {
    products = await ProductService.searchProducts(supabase, { brands, processors, rams, minPrice, maxPrice });
  } else {
    products = await ProductService.getRecentProducts(supabase, 8);
  }

  const auctions = await AuctionService.getActiveAuctions(supabase, 4);

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
              <div className="w-full max-w-md h-64 bg-secondary rounded-lg flex items-center justify-center relative overflow-hidden group">
                <Image 
                  src="/laptop-hero.png" 
                  alt="Premium Laptops" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions Section */}
      {auctions && auctions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Featured Auctions</h2>
              <p className="text-muted-foreground">Ending soon! Don't miss out on these deals.</p>
            </div>
            <Link href="/auctions" className="text-primary hover:underline font-semibold flex items-center gap-1 group">
              View All Auctions
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {auctions.map((auction: any) => {
              const product = auction.products;
              const currentBid = auction.bids?.reduce((max: number, b: any) => Math.max(max, b.amount), 0) || auction.starting_bid;
              
              return (
                <AuctionCard 
                  key={auction.id}
                  id={auction.id}
                  name={product.name}
                  brand={product.brand}
                  image={product.images?.[0]}
                  currentBid={currentBid}
                  numberOfBids={auction.bids?.length || 0}
                  endTime={auction.end_time}
                  rating={4.8}
                  seller="Verified Seller"
                />
              );
            })}
          </div>
        </section>
      )}

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

            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Recently Added
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Discover our latest inventory
                  </p>
                </div>
                <Link href="/products" className="text-primary hover:underline text-sm font-medium">
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product: any) => {
                  const auction = Array.isArray(product.auctions) ? product.auctions[0] : product.auctions;
                  const isAuction = auction && auction.status === 'active';
                  const currentBid = isAuction 
                    ? (auction.bids?.reduce((max: number, b: any) => Math.max(max, b.amount), 0) || auction.starting_bid)
                    : null;

                  return (
                    <ProductCard 
                      key={product.id} 
                      id={product.id}
                      name={product.name}
                      brand={product.brand}
                      price={product.price}
                      image={product.images?.[0]}
                      rating={4.5} // Mock for now as requested
                      reviews={12} // Mock for now
                      stock={product.stock}
                      badge={product.badge}
                      isAuction={isAuction}
                      currentBid={currentBid}
                      endTime={isAuction ? auction.end_time : null}
                    />
                  );
                })}
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
