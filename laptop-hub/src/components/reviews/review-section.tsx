"use client";

import { useState, useEffect } from "react";
import { ReviewService } from "@/services/review-service";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, StarHalf } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ReviewSection({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await ReviewService.getProductReviews(productId);
        setReviews(data || []);
      } catch (error) {
        console.error("Failed to load reviews", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to review");
      return;
    }
    if (!newReview.trim()) {
      toast.error("Please enter a review");
      return;
    }

    setIsSubmitting(true);
    try {
      const addedReview = await ReviewService.addReview(
        productId,
        user.id,
        rating,
        newReview
      );
      
      // Optimistic update
      setReviews([
        {
          ...addedReview,
          user: { id: user.id, raw_user_meta_data: { full_name: user.user_metadata?.full_name || "You" } }
        },
        ...reviews
      ]);
      setNewReview("");
      setRating(5);
      toast.success("Review submitted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (ratingValue: number, isInteractive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!isInteractive}
            onClick={() => isInteractive && setRating(star)}
            className={`${isInteractive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= ratingValue
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 mt-12 border-t pt-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">{averageRating}</div>
          <div>
            {renderStars(Number(averageRating))}
            <div className="text-sm text-muted-foreground mt-1">
              Based on {reviews.length} reviews
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-muted/30 p-6 rounded-xl border">
        <h3 className="font-semibold mb-4">Write a Review</h3>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="text-sm mb-2 text-muted-foreground">Rating</div>
              {renderStars(rating, true)}
            </div>
            <div>
              <Textarea
                placeholder="Share your experience with this laptop..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            Please log in to leave a review.
          </p>
        )}
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
             <div className="h-24 bg-muted rounded-xl"></div>
             <div className="h-24 bg-muted rounded-xl"></div>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {review.user?.raw_user_meta_data?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">
                    {review.user?.raw_user_meta_data?.full_name || "Unknown User"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="mb-3">{renderStars(review.rating)}</div>
              <p className="text-sm text-foreground/90">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </div>
        )}
      </div>
    </div>
  );
}
