"use client"

import { ChevronDown, Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SearchableSelectProps {
  options: string[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
  allowCustom?: boolean
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  allowCustom,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background",
          "hover:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          !value && "text-muted-foreground"
        )}
      >
        <span className="truncate">{value || placeholder || "Select..."}</span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-input bg-popover shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); setSearch("") }}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground",
                  value === opt && "bg-accent font-medium"
                )}
              >
                {opt}
              </button>
            ))}
            {allowCustom && search && !options.includes(search) && (
              <button
                type="button"
                onClick={() => { onChange(search); setOpen(false); setSearch("") }}
                className="w-full text-left px-3 py-1.5 text-sm rounded-sm hover:bg-accent italic text-muted-foreground"
              >
                Use &ldquo;{search}&rdquo;
              </button>
            )}
            {filtered.length === 0 && !allowCustom && (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
