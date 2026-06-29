import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: reviews, error: reviewsError } = await supabase.from('reviews').select('*');
  console.log('Reviews error:', reviewsError);
  console.log('Total reviews:', reviews?.length);

  if (reviews && reviews.length > 0) {
    const userIds = [...new Set(reviews.map(r => r.user_id))];
    const { data: users, error: usersError } = await supabase.from('users').select('id, name').in('id', userIds);
    console.log('Users error:', usersError);
    console.log('Fetched users:', users);
  }
}

checkDatabase();

