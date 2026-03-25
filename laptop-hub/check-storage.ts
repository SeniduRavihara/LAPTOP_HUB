import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
  console.log("Checking Supabase Storage...");
  console.log(`URL: ${supabaseUrl}`);
  
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  
  if (bucketError) {
    console.error("Error listing buckets:", bucketError);
  } else {
    console.log("Found Buckets:");
    buckets.forEach(b => console.log(`- ${b.name} (Public: ${b.public})`));
    
    const productImageBucket = buckets.find(b => b.name === 'product-images');
    if (!productImageBucket) {
      console.error("CRITICAL: 'product-images' bucket NOT FOUND!");
    } else {
      console.log("'product-images' bucket exists.");
    }
  }

  // Try to list files in the bucket
  console.log("Attempting to list files in 'product-images'...");
  const { data: files, error: fileError } = await supabase.storage
    .from('product-images')
    .list('', { limit: 5 });

  if (fileError) {
    console.error("Error listing files:", fileError);
  } else {
    console.log(`Successfully listed ${files.length} file(s) in 'product-images'.`);
  }
}

checkStorage();
