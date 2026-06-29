"use client"

import { Plus, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { SPEC_DEFINITIONS } from "./constants"

interface SpecTypePickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (key: string) => void
  usedKeys: string[]
}

export function SpecTypePickerModal({
  open,
  onClose,
  onSelect,
  usedKeys,
}: SpecTypePickerModalProps) {
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!open) { setSearch(""); return }
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    if (open) document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  const entries = Object.entries(SPEC_DEFINITIONS).filter(
    ([key, def]) =>
      !usedKeys.includes(key) &&
      def.label.toLowerCase().includes(search.toLowerCase())
  )

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-12 pointer-events-none"
        aria-modal="true"
        role="dialog"
      >
        <div className="relative w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col max-h-[80vh] pointer-events-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
            <div>
              <h3 className="font-semibold text-base">Add Specification</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Choose a spec type to add to this product</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-4 py-3 border-b shrink-0">
            <div className="flex items-center gap-2 rounded-lg border border-input bg-muted/40 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search spec type..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {entries.map(([key, def]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { onSelect(key); onClose() }}
                  className="flex flex-col items-start text-left px-4 py-3 rounded-xl border border-border hover:border-primary/50 hover:bg-accent/50 transition-all group"
                >
                  <span className="text-sm font-medium leading-tight group-hover:text-foreground">{def.label}</span>
                  <span className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {def.options.slice(0, 3).join(" \u00b7 ")}
                  </span>
                </button>
              ))}
              {entries.length === 0 && (
                <div className="col-span-3 py-10 text-center text-sm text-muted-foreground">
                  No matching spec types
                </div>
              )}
            </div>
          </div>

          <div className="px-4 py-3 border-t shrink-0 bg-muted/20">
            <button
              type="button"
              onClick={() => { onSelect("custom"); onClose() }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent/30 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Add custom spec (not in list)
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
