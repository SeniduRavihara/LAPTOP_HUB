"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { wishlistService } from "@/services/wishlist-service";

import { ReviewSection } from "@/components/reviews/review-section";

interface ProductDetailPageProps {
  product: any;
  initialIsWishlisted?: boolean;
}

export function ProductDetailPage({ product, initialIsWishlisted = false }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const { addToCart, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    setIsWishlisted(initialIsWishlisted);
  }, [initialIsWishlisted]);

  if (!product) return null;

  const images = product.images || ["/placeholder.svg"];
  const specs = product.specs 
    ? (Array.isArray(product.specs) 
        ? product.specs 
        : Object.entries(product.specs).map(([key, value]) => ({ key, value })))
    : [];
  const originalPrice = product.original_price || product.price * 1.15;

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      setIsWishlistLoading(true);
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(product.id, user.id);
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistService.addToWishlist(product.id, user.id);
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error("Failed to update wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

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

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      quantity: quantity,
                      image: images[0],
                      brand: product.brand
                    });
                    toast.success(`${product.name} added to cart!`, {
                      action: {
                        label: "View Cart",
                        onClick: () => router.push("/cart")
                      }
                    });
                  }}
                  variant="outline"
                  className="flex-1 h-12 rounded-lg font-semibold text-lg border-border"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={() => {
                    clearCart();
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      quantity: quantity,
                      image: images[0],
                      brand: product.brand
                    });
                    router.push("/checkout");
                  }}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg font-semibold text-lg"
                >
                  Buy Now
                </Button>
              </div>

              <Button
                onClick={handleWishlistToggle}
                disabled={isWishlistLoading}
                className={`w-full h-12 rounded-lg font-semibold text-lg transition-colors ${
                  isWishlisted
                    ? "bg-red-500/10 text-red-600 border border-red-500"
                    : "bg-secondary hover:bg-secondary/80 border border-border text-foreground"
                } ${isWishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <ReviewSection productId={product.id} />
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
