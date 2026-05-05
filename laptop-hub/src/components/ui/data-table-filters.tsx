"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./button";

interface FilterOption {
  label: string;
  value: string;
}

interface DataTableFiltersProps {
  searchPlaceholder?: string;
  filterKey?: string;
  filterLabel?: string;
  filterOptions?: FilterOption[];
  // Support multiple filters if needed in future, but keeping it simple for now
}

export function DataTableFilters({
  searchPlaceholder = "Search...",
  filterKey,
  filterLabel,
  filterOptions,
}: DataTableFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const currentFilterValue = searchParams.get(filterKey || "") || "all";

  // Debounced search update
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (searchValue === currentSearch) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        params.set("search", searchValue);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, pathname, router, searchParams]);

  const onFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(filterKey!, value);
    } else if (filterKey) {
      params.delete(filterKey);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearchValue("");
    router.replace(pathname, { scroll: false });
  };

  const hasFilters = searchValue || (filterKey && searchParams.get(filterKey));

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9"
        />
      </div>

      {filterKey && filterOptions && (
        <Select value={currentFilterValue} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={filterLabel || "Filter"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All {filterLabel}s</SelectItem>
            {filterOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasFilters && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="h-10 px-2 lg:px-3"
        >
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
