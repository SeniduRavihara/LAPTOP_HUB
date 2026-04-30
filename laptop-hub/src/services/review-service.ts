import { supabase as browserClient } from "@/lib/supabase/client";

export class ReviewService {
  private static getClient(supabaseOverride?: any) {
    return supabaseOverride || browserClient;
  }

  static async getProductReviews(productId: string, supabaseOverride?: any) {
    const supabase = this.getClient(supabaseOverride);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          user:user_id (
            id,
            raw_user_meta_data
          )
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("ReviewService.getProductReviews error:", error);
      throw error;
    }
  }

  static async addReview(
    productId: string,
    userId: string,
    rating: number,
    comment: string,
    supabaseOverride?: any
  ) {
    const supabase = this.getClient(supabaseOverride);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            product_id: productId,
            user_id: userId,
            rating,
            comment,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("ReviewService.addReview error:", error);
      throw error;
    }
  }
}
