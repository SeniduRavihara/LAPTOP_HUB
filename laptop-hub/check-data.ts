import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, images")
    .limit(5);

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log("Product Data:");
  data.forEach(p => {
    console.log(`- ID: ${p.id}`);
    console.log(`  Name: ${p.name}`);
    console.log(`  Images Type: ${typeof p.images}`);
    console.log(`  Images Value:`, p.images);
    if (Array.isArray(p.images)) {
      console.log(`  Images[0]: ${p.images[0]}`);
    } else if (typeof p.images === 'string') {
        try {
            const parsed = JSON.parse(p.images);
            console.log(`  Parsed Images Type: ${typeof parsed}`);
            console.log(`  Parsed Images[0]: ${parsed[0]}`);
        } catch (e) {
            console.log(`  Not a JSON string`);
        }
    }
  });
}

checkData();
