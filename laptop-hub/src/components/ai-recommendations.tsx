"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Sparkles, Brain, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIRecommendationsProps {
  query: string;
}

interface Recommendation {
  productId: string;
  reason: string;
  matchScore: number;
  product: any;
}

export function AIRecommendations({ query }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [fallbackProducts, setFallbackProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      setError(null);
      setApiKeyMissing(false);
      
      try {
        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load recommendations");
        }

        if (data.error && data.error.includes("GEMINI_API_KEY")) {
          setApiKeyMissing(true);
          setFallbackProducts(data.fallbackProducts || []);
        } else {
          setRecommendations(data.recommendations || []);
        }
      } catch (err: any) {
        console.error("AI Recommendations error:", err);
        setError(err.message || "An unexpected error occurred while fetching recommendations.");
      } finally {
        setLoading(false);
      }
    }

    if (query) {
      fetchRecommendations();
    }
  }, [query]);

  if (!query) return null;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none">
          <Brain className="w-full h-full text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                AI Smart Search
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">AI Assistant Recommendations</h2>
            <p className="text-white/80 text-sm mt-1 max-w-xl">
              We couldn't find exact keyword matches, so our Gemini AI analyzed your request: 
              <span className="italic font-medium text-yellow-200"> "{query}"</span> to find the best alternative matches in our inventory.
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI is scanning inventory...</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              Analyzing CPU performance, RAM specifications, and pricing to match your request.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">AI Recommendation Error</h4>
            <p className="text-sm opacity-90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* API Key Missing Instruction State */}
      {apiKeyMissing && !loading && (
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-amber-800 dark:text-amber-300 flex items-start gap-4">
            <Brain className="w-6 h-6 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="space-y-2">
              <h4 className="font-bold text-base">Setup Required: GEMINI_API_KEY</h4>
              <p className="text-sm opacity-90 leading-relaxed">
                The AI smart recommendation requires a Gemini API Key. To see this active in your local development environment:
              </p>
              <ol className="list-decimal pl-4 text-sm space-y-1 opacity-90 font-mono">
                <li>Open <code className="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">.env.local</code> in the root directory.</li>
                <li>Add your key: <code className="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">GEMINI_API_KEY=your_actual_key</code></li>
                <li>Restart the development server if needed.</li>
              </ol>
              <p className="text-xs text-muted-foreground mt-2">
                (For demonstration purposes, we are displaying fallback matches below from your product database.)
              </p>
            </div>
          </div>

          {/* Fallback Products Listing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallbackProducts.map((p) => (
              <div key={p.id} className="relative group h-full flex flex-col">
                <div className="absolute top-3 left-3 z-15">
                  <Badge className="bg-amber-500 text-white border-none shadow-sm">
                    Demo Match
                  </Badge>
                </div>
                <ProductCard
                  id={p.id}
                  name={p.name}
                  brand={p.brand}
                  price={p.price}
                  image={p.product?.images?.[0] || "/placeholder.svg"}
                  rating={4.5}
                  reviews={15}
                  stock={p.stock}
                  isAuction={p.isAuction}
                  auctionId={null}
                  currentBid={null}
                  endTime={null}
                  initialIsWishlisted={false}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Listing */}
      {!loading && !error && !apiKeyMissing && recommendations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => {
            const p = rec.product;
            const auction = Array.isArray(p.auctions) ? p.auctions[0] : p.auctions;
            const isAuction = auction && auction.status === 'active';
            const currentBid = isAuction 
              ? (auction.bids?.reduce((max: number, b: any) => Math.max(max, b.amount), 0) || auction.starting_bid)
              : null;

            return (
              <div key={p.id} className="relative flex flex-col h-full bg-card rounded-2xl border border-border/80 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                {/* AI Recommendation Badge / Reason Header */}
                <div className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border-b border-border/50 p-4 relative">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-violet-700 dark:text-violet-400 font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5 fill-violet-700 dark:fill-violet-400 animate-pulse" />
                      AI RECOMMENDED
                    </div>
                    <Badge className="bg-violet-600 hover:bg-violet-700 text-white font-mono font-bold text-xs py-0.5 px-2 rounded-full">
                      {rec.matchScore}% Match
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
                    "{rec.reason}"
                  </p>
                </div>

                {/* Product Card Container */}
                <div className="p-4 flex-1">
                  <ProductCard
                    id={p.id}
                    name={p.name}
                    brand={p.brand}
                    price={p.price}
                    image={p.images?.[0]}
                    rating={4.5}
                    reviews={10}
                    stock={p.stock}
                    badge={p.badge}
                    isAuction={isAuction}
                    auctionId={isAuction ? auction.id : null}
                    currentBid={currentBid}
                    endTime={isAuction ? auction.end_time : null}
                    initialIsWishlisted={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Recommendations Returned */}
      {!loading && !error && !apiKeyMissing && recommendations.length === 0 && (
        <div className="bg-card border border-border border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">AI could not find matching alternatives</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm">
              Even with smart search, we couldn't find any laptops in our database that could satisfy your request. Try adjusting your specifications.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
