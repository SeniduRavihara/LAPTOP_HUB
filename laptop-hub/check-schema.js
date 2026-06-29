import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data: auction } = await supabase.from('auctions').select('*').limit(1);
  console.log("Auction columns:", Object.keys(auction?.[0] || {}));
  
  const { data: order } = await supabase.from('orders').select('*').limit(1);
  console.log("Order columns:", Object.keys(order?.[0] || {}));
}

checkSchema();
