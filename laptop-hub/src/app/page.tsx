import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { ProductService } from "@/services/product-service";
import { AuctionService } from "@/services/auction-service";
import HomePageClient from "@/components/home/HomePageClient";

export default async function HomePage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  // We can still await searchParams if needed by future logic
  const searchParams = props.searchParams ? await props.searchParams : {};

  const products = (await ProductService.getRecentProducts(8, supabase)) as any[];
  const auctions: any[] = (await AuctionService.getActiveAuctions(4, supabase)) as any[];

  // Fetch user wishlist if logged in
  const { data: { user } } = await supabase.auth.getUser();
  let wishlistedProductIds: string[] = [];
  
  if (user) {
    const { data: wishlistData } = await supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", user.id);
      
    if (wishlistData) {
      wishlistedProductIds = wishlistData.map(item => item.product_id);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <HomePageClient products={products} auctions={auctions} wishlistedProductIds={wishlistedProductIds} />
      </main>
      <Footer />
    </>
  );
}
