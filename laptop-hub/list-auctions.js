const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteDuplicate() {
  console.log("Deleting duplicate product...");
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", "abf6102e-77c1-4c1f-a42f-1fcbd2193359")
    .select();

  if (error) {
    console.error("Error deleting product:", error);
    return;
  }

  console.log("Deleted product:", data);
}

deleteDuplicate();
