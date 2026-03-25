const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAuctions() {
  console.log("Checking Auctions Table (Plain JS)...");
  const { data: auctions, error: err } = await supabase
    .from("auctions")
    .select("*");

  if (err) {
    console.error("Error fetching auctions:", err);
    return;
  }

  console.log(`Found ${auctions.length} total auctions.`);
  auctions.forEach(a => {
    console.log(`- ID: ${a.id}, Status: ${a.status}, EndTime: ${a.end_time}`);
  });
}

checkAuctions();
