export const dynamic = "force-dynamic";
import { ProductCard } from "@/components/product-card";
import { AuctionCard } from "@/components/auction-card";
import { ProductFilters } from "@/components/product-filters";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { ProductService } from "@/services/product-service";
import Link from "next/link";
import { SortSelector } from "@/components/sort-selector";
import { Search, SlidersHorizontal, PackageX } from "lucide-react";
import { AIRecommendations } from "@/components/ai-recommendations";

export default async function ProductsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  const searchParams = props.searchParams ? await props.searchParams : {};

  // Extract params
  const query = searchParams.query as string | undefined;
  const brands = searchParams.brands ? (searchParams.brands as string).split(',') : undefined;
  const processors = searchParams.processors ? (searchParams.processors as string).split(',') : undefined;
  const rams = searchParams.rams ? (searchParams.rams as string).split(',') : undefined;
  const storages = searchParams.storages ? (searchParams.storages as string).split(',') : undefined;
  const gpus = searchParams.gpus ? (searchParams.gpus as string).split(',') : undefined;
  const minPrice = searchParams.minPrice as string | undefined;
  const maxPrice = searchParams.maxPrice as string | undefined;
  const sort = searchParams.sort as string | undefined;

  // Fetch data
  const products = await ProductService.searchProducts(
    { query, brands, processors, rams, storages, gpus, minPrice, maxPrice }, 
    supabase
  ) as any[];

  // Sort data (in-memory for now, can move to RPC later)
  let sortedProducts = [...(products || [])];
  if (sort === "price_low") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price_high") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "newest") {
    sortedProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const rawTypes = searchParams.types;
  // If no types are specified in URL, default to Standard. To show all, URL would need types=Standard,Auction
  const filterTypes = rawTypes ? (rawTypes as string).split(',') : ['Standard'];

  // Filter by type (in-memory)
  if (filterTypes && filterTypes.length > 0 && filterTypes.length < 2) {
    const isLookingForAuction = filterTypes.includes('Auction');
    sortedProducts = sortedProducts.filter(p => {
      const auction = Array.isArray(p.auctions) ? p.auctions[0] : p.auctions;
      const isAuction = auction && (auction.status === 'active' || auction.status === 'pending');
      return isLookingForAuction ? isAuction : !isAuction;
    });
  }

  // Fetch wishlist
  const { data: { user } } = await supabase.auth.getUser();
  let wishlistedProductIds = new Set<string>();
  if (user) {
    const { data: wishlistData } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', user.id);
    if (wishlistData) {
      wishlistedProductIds = new Set(wishlistData.map((w: any) => w.product_id));
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] dark:bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><span className="mx-2">/</span></li>
            <li className="font-medium text-foreground">Search Results</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-64 shrink-0 lg:sticky lg:top-24 self-start">
            <ProductFilters />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Search Results Header */}
            <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-start gap-2">
                  {query ? (
                    <>
                      <Search className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0 mt-0.5" />
                      <span className="break-words">
                        Results for <span className="text-primary">"{query}"</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <SlidersHorizontal className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0 mt-0.5" />
                      <span>All Products</span>
                    </>
                  )}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Found <span className="font-semibold text-foreground">{sortedProducts.length}</span> items matching your search
                </p>
              </div>

              {/* Sorting */}
              <SortSelector currentSort={sort || "relevance"} />
            </div>

            {/* Results Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product) => {
                  const auction = Array.isArray(product.auctions) ? product.auctions[0] : product.auctions;
                  const isAuction = auction && auction.status === 'active';
                  const currentBid = isAuction 
                    ? (auction.bids?.reduce((max: number, b: any) => Math.max(max, b.amount), 0) || auction.starting_bid)
                    : null;

                  if (isAuction) {
                    return (
                      <AuctionCard 
                        key={auction.id}
                        id={auction.id}
                        productId={product.id}
                        name={product.name || 'Unknown Laptop'}
                        brand={product.brand}
                        image={product.images?.[0]}
                        currentBid={currentBid}
                        numberOfBids={auction.bids?.length || 0}
                        endTime={auction.end_time}
                        rating={4.8}
                        seller="Verified Seller"
                        initialIsWatching={wishlistedProductIds.has(product.id)}
                      />
                    );
                  }

                  return (
                    <ProductCard 
                      key={product.id} 
                      id={product.id}
                      name={product.name}
                      brand={product.brand}
                      price={product.price}
                      originalPrice={product.original_price}
                      image={product.images?.[0]}
                      rating={4.5} 
                      reviews={12}
                      stock={product.stock}
                      badge={product.badge}
                      isAuction={false}
                      auctionId={null}
                      currentBid={null}
                      endTime={null}
                      initialIsWishlisted={wishlistedProductIds.has(product.id)}
                    />
                  );
                })}
              </div>
            ) : query ? (
              <AIRecommendations query={query} />
            ) : (
              /* No Results State */
              <div className="bg-card border border-border border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                  <PackageX className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">No products found</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                    We couldn't find any laptops matching your current search or filters. Try adjusting your search term or clearing some filters.
                  </p>
                </div>
                <Link 
                  href="/products" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Clear All Filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
