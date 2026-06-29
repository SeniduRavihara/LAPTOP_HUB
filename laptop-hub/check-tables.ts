import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Checking if 'messages' table exists...");
  const { data: messages, error: messagesError } = await supabase.from('messages').select('*').limit(1);
  console.log("messages query status:", messagesError ? messagesError.message : "Success (Table exists!)");

  console.log("Checking if 'wishlists' table exists...");
  const { data: wishlists, error: wishlistsError } = await supabase.from('wishlists').select('*').limit(1);
  console.log("wishlists query status:", wishlistsError ? wishlistsError.message : "Success (Table exists!)");
}

main();
