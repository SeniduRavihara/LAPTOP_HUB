import { createClient } from '@supabase/supabase-js';
import { ProductService } from './src/services/product-service';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const { ProductService } = await import('./src/services/product-service');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Fetching searchProducts for products page...");
  const products = await ProductService.searchProducts(
    { query: undefined, brands: undefined, processors: undefined, rams: undefined, minPrice: undefined, maxPrice: undefined },
    supabase
  );

  console.log("Fetched products count:", products?.length);
  for (const p of products || []) {
    const auction = Array.isArray(p.auctions) ? p.auctions[0] : p.auctions;
    if (auction) {
      console.log(`Product: ${p.name} (ID: ${p.id})`);
      console.log(`- Auction:`, auction);
    }
  }
}

main();
