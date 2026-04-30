import { ProductCard } from "@/components/product-card";
import { AuctionCard } from "@/components/auction-card";
import { ProductFilters } from "@/components/product-filters";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
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

  // Always fetch recent products for the homepage
  const products = (await ProductService.getRecentProducts(8, supabase)) as any[];
  const auctions: any[] = (await AuctionService.getActiveAuctions(4, supabase)) as any[];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  LKR 1,000,000+ in Savings
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
                  Premium Laptops <br /><span className="text-primary">Unbeatable Deals</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto md:mx-0">
                  Discover the latest tech from Apple, Dell, HP, and more. 
                  Verified listings, secure bidding, and island-wide delivery.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Link
                    href="/products"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
                  >
                    Start Shopping
                  </Link>
                  <Link
                    href="/auctions"
                    className="bg-background border border-primary text-primary hover:bg-primary/5 px-8 py-4 rounded-xl font-bold transition-all"
                  >
                    Explore Auctions
                  </Link>
                </div>
              </div>
              <div className="flex-1 hidden md:flex justify-end">
                <div className="w-full max-w-md aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center relative overflow-hidden group shadow-2xl">
                  <Image 
                    src="/laptop-hero.png" 
                    alt="Premium Laptops" 
                    fill 
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Auctions Section */}
        {auctions && auctions.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 text-center md:text-left">
              <div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Featured Auctions</h2>
                <p className="text-muted-foreground mt-2">Ending soon! Grab your dream laptop at your price.</p>
              </div>
              <Link href="/auctions" className="text-primary hover:underline font-bold flex items-center justify-center gap-1 group">
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

        {/* Recently Added Section */}
        <section
          id="products"
          className="bg-secondary/30 border-y border-border"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 text-center md:text-left">
              <div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Recently Added</h2>
                <p className="text-muted-foreground mt-2">Check out our freshest inventory just arrived.</p>
              </div>
              <Link href="/products" className="bg-background border border-border hover:bg-secondary px-6 py-2 rounded-lg text-sm font-bold transition-colors">
                View Catalog
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    rating={4.5}
                    reviews={12}
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
        </section>

        <Footer />
      </main>
    </>
  );
}
