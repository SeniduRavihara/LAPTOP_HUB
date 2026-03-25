import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAuctions() {
  console.log("Checking Auctions Table...");
  const { data: auctions, error: err } = await supabase
    .from("auctions")
    .select("*, products(name)");

  if (err) {
    console.error("Error fetching auctions:", err);
    return;
  }

  console.log(`Found ${auctions.length} total auctions.`);
  auctions.forEach(a => {
    console.log(`- ID: ${a.id}`);
    console.log(`  Product: ${a.products?.name || 'MISSING'}`);
    console.log(`  Status: ${a.status}`);
    console.log(`  End Time: ${a.end_time}`);
  });

  const { data: active, error: activeErr } = await supabase
    .from("auctions")
    .select("id")
    .eq("status", "active");

  if (activeErr) console.error("Error fetching active:", activeErr);
  else console.log(`Found ${active.length} active auctions.`);
}

checkAuctions();
