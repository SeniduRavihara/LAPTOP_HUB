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

  // Always fetch recent products for the homepage
  const products = (await ProductService.getRecentProducts(8, supabase)) as any[];
  const auctions: any[] = (await AuctionService.getActiveAuctions(4, supabase)) as any[];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <HomePageClient products={products} auctions={auctions} />
      </main>
      <Footer />
    </>
  );
}
