import { createClient } from '@/lib/supabase/client';

export const wishlistService = {
  // Add item to wishlist
  addToWishlist: async (productId: string, userId: string) => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('wishlists')
      .insert([
        { user_id: userId, product_id: productId }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
    
    return data;
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId: string, userId: string) => {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .match({ user_id: userId, product_id: productId });

    if (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
    
    return true;
  },

  // Check if item is in wishlist
  isInWishlist: async (productId: string, userId: string) => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('wishlists')
      .select('id')
      .match({ user_id: userId, product_id: productId })
      .maybeSingle();

    if (error) {
      console.error('Error checking wishlist status:', error);
      return false; // Fail gracefully
    }
    
    return !!data;
  },

  // Get user's entire wishlist
  getUserWishlist: async (userId: string) => {
    const supabase = createClient();
    
    // We'll likely need to join with products/auctions table based on product_id
    // For now, let's just fetch the base wishlist entries
    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        *,
        product:products (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user wishlist:', error);
      throw error;
    }
    
    return data;
  }
};
