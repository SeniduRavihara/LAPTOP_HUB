"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Suspense } from "react";

function NavbarContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const params = new URLSearchParams(searchParams?.toString());
    params.set("query", searchQuery.trim());
    router.push(`/products?${params.toString()}`);
  };

  // Sync search input with URL
  useEffect(() => {
    const query = searchParams?.get("query");
    if (query) setSearchQuery(query);
  }, [searchParams]);

  // Hide navbar elements on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">L</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              LaptopHub
            </span>
          </Link>

          {/* Search Bar - Hidden on auth pages */}
          {!isAuthPage && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden md:flex">
              <div className={`relative w-full rounded-lg transition-all ${isAiMode ? 'ring-2 ring-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.2)]' : ''}`}>
                <Input
                  type="text"
                  placeholder={isAiMode ? "Ask AI to find a laptop..." : "Search laptops, brands, or specs..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-4 pr-20 rounded-lg border border-border bg-secondary text-foreground focus:bg-background transition-all ${isAiMode ? 'border-primary/50 placeholder:text-primary/60' : ''}`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsAiMode(!isAiMode)}
                    className={`p-1.5 rounded-md transition-all ${isAiMode ? 'bg-primary/20 text-primary scale-110' : 'text-muted-foreground hover:bg-secondary-foreground/5 hover:text-foreground'}`}
                    title="Toggle AI Mode"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button 
                    type="submit"
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Right Actions - Simplified on auth pages */}
          <div className="flex items-center gap-3 md:gap-6">
            {!isAuthPage && (
              <>
                <Link
                  href="/auctions"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
                >
                  Auctions
                </Link>
                <Link
                  href="/cart"
                  className="relative text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                </Link>
              </>
            )}

            {user ? (
              <UserNav />
            ) : (
              !isAuthPage && (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="hidden sm:inline-flex rounded-lg h-9">
                      Sign In
                    </Button>
                  </Link>
                  <Button className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9 shadow-sm">
                    Sell Now
                  </Button>
                </>
              )
            )}
          </div>
        </div>

        {/* Mobile Search - Hidden on auth pages */}
        {!isAuthPage && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className={`relative w-full rounded-lg transition-all ${isAiMode ? 'ring-2 ring-primary/50 shadow-[0_0_10px_rgba(var(--primary),0.2)]' : ''}`}>
                <Input
                  type="text"
                  placeholder={isAiMode ? "Ask AI..." : "Search..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-4 pr-20 rounded-lg border border-border bg-secondary text-foreground text-sm transition-all ${isAiMode ? 'border-primary/50 placeholder:text-primary/60' : ''}`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsAiMode(!isAiMode)}
                    className={`p-1.5 rounded-md transition-all ${isAiMode ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button 
                    type="submit"
                    className="p-1.5 text-muted-foreground"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={
      <nav className="bg-background border-b border-border sticky top-0 z-50 h-16 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-lg animate-pulse" />
            <div className="w-24 h-6 bg-secondary rounded animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-secondary rounded-full animate-pulse" />
            <div className="w-8 h-8 bg-secondary rounded-full animate-pulse" />
          </div>
        </div>
      </nav>
    }>
      <NavbarContent />
    </Suspense>
  );
}
