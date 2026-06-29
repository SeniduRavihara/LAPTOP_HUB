"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelector({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sort by:</span>
      <select 
        onChange={handleSortChange}
        className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        value={currentSort || "relevance"}
      >
        <option value="relevance">Relevance</option>
        <option value="newest">Newest Arrivals</option>
        <option value="price_low">Price: Low to High</option>
        <option value="price_high">Price: High to Low</option>
      </select>
    </div>
  );
}
