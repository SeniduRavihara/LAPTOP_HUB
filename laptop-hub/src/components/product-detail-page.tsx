"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface ProductDetailPageProps {
  product: any;
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { user } = useAuth();

  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    if (!product?.id) {
      setIsLoadingReviews(false);
      return;
    }
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${product.id}`);
        const data = await res.json();
        if (data.reviews) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [product?.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to leave a review.");
    if (!comment.trim()) return alert("Please enter a comment.");
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          rating,
          comment,
        }),
      });
      const data = await res.json();
      if (res.ok && data.review) {
        // Attach local user name for immediate UI feedback
        const newReview = data.review;
        const reviewerName = user?.user_metadata?.name || user?.email?.split('@')[0] || "You";
        
        setReviews([{ ...newReview, user_name: reviewerName }, ...reviews]);
        setComment("");
        setRating(5);
      } else {
        alert(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  const images = product.images || ["/placeholder.svg"];
  const specs = product.specs 
    ? (Array.isArray(product.specs) 
        ? product.specs 
        : Object.entries(product.specs).map(([key, value]) => ({ key, value })))
    : [];
  const originalPrice = product.original_price || product.price * 1.15;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images */}
        <div className="lg:col-span-1">
          <div className="bg-secondary border border-border rounded-lg overflow-hidden mb-4">
            <div className="relative w-full h-96">
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                onError={() => console.log(`Detail main image failed to load: ${images[selectedImage]}`)}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {images.map((image: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-full h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === idx
                    ? "border-primary"
                    : "border-border hover:border-border/50"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`View ${idx + 1}`}
                  fill
                  unoptimized
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-2">
              {product.brand}
            </p>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">
                {product.rating || 4.5}
              </span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-4xl font-bold text-primary">
                  LKR {product.price?.toLocaleString()}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  LKR {originalPrice?.toLocaleString()}
                </span>
                <span className="text-lg font-bold text-green-600">
                  {Math.round(
                    (1 - product.price / originalPrice) * 100
                  )}
                  % off
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Free shipping on orders over LKR 50,000
              </p>
            </div>

            {/* Seller Info */}
            <div className="bg-secondary border border-border rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Sold by</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    {product.seller_name || "Verified Seller"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.sellerRating || 4.8)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      {product.sellerRating || 4.8}
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="border border-border">
                  View Store
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <p
                className={`text-sm font-semibold ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : "Out of Stock"}
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  Quantity
                </span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-l border-r border-border text-foreground font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg font-semibold text-lg">
                Add to Cart
              </Button>

              <Button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-full h-12 rounded-lg font-semibold text-lg transition-colors ${
                  isWishlisted
                    ? "bg-red-500/10 text-red-600 border border-red-500"
                    : "bg-secondary hover:bg-secondary/80 border border-border text-foreground"
                }`}
              >
                {isWishlisted ? "♥ Added to Wishlist" : "☆ Add to Wishlist"}
              </Button>
            </div>

            {/* Key Features */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-4">
                Key Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {specs.slice(0, 8).map((spec: any, idx: number) => (
                  <div key={idx}>
                    <p className="text-xs text-muted-foreground mb-1">
                      {spec.key}
                    </p>
                    <p className="font-medium text-foreground text-sm">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              About this product
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {product.description}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The Dell XPS 13 Plus is designed for professionals who demand the
              best. With its sleek design, powerful performance, and stunning
              display, it&apos;s perfect for everyday computing, content
              creation, and professional work.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Customer Reviews
            </h2>

            {/* Review Form */}
            {user ? (
              <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-secondary/30 rounded-lg border border-border">
                <h3 className="font-semibold mb-3">Write a Review</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} transition-colors`}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="What did you like or dislike?"
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-secondary/30 rounded-lg border border-border flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Log in to leave a review.</p>
                <Button variant="outline" asChild>
                  <a href="/login">Log In</a>
                </Button>
              </div>
            )}

            <div className="space-y-6">
              {isLoadingReviews ? (
                <p className="text-sm text-muted-foreground">Loading reviews...</p>
              ) : reviews.length > 0 ? (
                reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="pb-6 border-b border-border last:border-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{review.user_name || "Verified Buyer"}</p>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
            <h3 className="font-bold text-foreground mb-4">
              Delivery Information
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Standard Shipping</p>
                <p className="font-semibold text-foreground">Free</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Express Shipping</p>
                <p className="font-semibold text-foreground">$19.99</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Estimated Delivery</p>
                <p className="font-semibold text-foreground">
                  3-5 business days
                </p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-muted-foreground mb-2">Warranty</p>
                <p className="text-xs text-muted-foreground">
                  1 year manufacturer warranty included
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
