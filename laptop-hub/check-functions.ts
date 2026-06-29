import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Fetching routines...");
  const { data, error } = await supabase
    .from('pg_proc')
    .select('proname')
    .limit(100);

  if (error) {
    console.error("Error fetching routines from pg_proc directly:", error.message);
  } else {
    console.log("Routines:", data.map(d => d.proname));
  }

  // Also check if we can query pg_catalog or information_schema via RPC or other views
  const { data: schemas, error: schemasError } = await supabase
    .rpc('get_schemas'); // just in case there's an RPC
  console.log("get_schemas RPC result:", schemasError ? schemasError.message : schemas);
}

main();
