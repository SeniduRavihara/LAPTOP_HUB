"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

export function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = {
    name: 'Dell XPS 13 Plus Laptop - 13.4" FHD Display',
    brand: "Dell",
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 328,
    inStock: true,
    seller: "TechStore_Pro",
    sellerRating: 4.8,
    description:
      "Premium ultrabook with Intel Core i7, 16GB RAM, and lightning-fast 512GB SSD. Perfect for professionals and creative work.",
    specs: [
      { label: "Display", value: '13.4" FHD (1920x1200)' },
      { label: "Processor", value: "Intel Core i7-1280P" },
      { label: "RAM", value: "16GB LPDDR5" },
      { label: "Storage", value: "512GB NVMe SSD" },
      { label: "Graphics", value: "Intel Iris Xe" },
      { label: "Battery", value: "Up to 12 hours" },
      { label: "Weight", value: "2.8 lbs" },
      { label: "OS", value: "Windows 11 Pro" },
    ],
    images: [
      "/placeholder.svg?key=6xdaw",
      "/placeholder.svg?key=jr2kp",
      "/placeholder.svg?key=88r7h",
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images */}
        <div className="lg:col-span-1">
          <div className="bg-secondary border border-border rounded-lg overflow-hidden mb-4">
            <div className="relative w-full h-96">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, idx) => (
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
                {product.rating}
              </span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-4xl font-bold text-primary">
                  ${product.price}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
                <span className="text-lg font-bold text-green-600">
                  {Math.round(
                    (1 - product.price / product.originalPrice) * 100
                  )}
                  % off
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Free shipping on orders over $50
              </p>
            </div>

            {/* Seller Info */}
            <div className="bg-secondary border border-border rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Sold by</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    {product.seller}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.sellerRating)
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
                      {product.sellerRating}
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
                  product.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.inStock ? "✓ In Stock" : "Out of Stock"}
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
                {product.specs.slice(0, 6).map((spec, idx) => (
                  <div key={idx}>
                    <p className="text-xs text-muted-foreground mb-1">
                      {spec.label}
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
            <div className="space-y-6">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="pb-6 border-b border-border last:border-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">John Doe</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      2 days ago
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Excellent laptop! Very fast, sleek design, and great battery
                    life. Highly recommend for professionals.
                  </p>
                </div>
              ))}
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
