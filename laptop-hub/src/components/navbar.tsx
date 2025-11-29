"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const pathname = usePathname();

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
            <div className="flex-1 max-w-md mx-4 hidden md:flex">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search laptops, accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 rounded-lg border border-border bg-secondary"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
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
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    0
                  </span>
                </Link>
              </>
            )}

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="hidden sm:inline-flex"
                  size="sm"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              !isAuthPage && (
                <>
                  <Link href="/login">
                    <Button className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9">
                      Sign In
                    </Button>
                  </Link>
                  <Button className="hidden sm:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg h-9">
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
            <Input
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-10 rounded-lg border border-border bg-secondary text-sm"
            />
          </div>
        )}
      </div>
    </nav>
  );
}
