import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`;
  const anonKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });
    
    if (!res.ok) {
      console.error("HTTP error:", res.status, await res.text());
      return;
    }
    
    const schema = await res.json();
    console.log("Exposed RPC functions:");
    const paths = Object.keys(schema.paths || {});
    const rpcs = paths.filter(p => p.startsWith('/rpc/'));
    console.log(rpcs);
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

main();
