"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SPEC_DEFINITIONS } from "./constants"
import { SearchableSelect } from "./searchable-select"

interface SpecRowProps {
  specKey: string
  specValue: string
  onKeyChange: (v: string) => void
  onValueChange: (v: string) => void
  onRemove: () => void
}

export function SpecRow({
  specKey,
  specValue,
  onKeyChange,
  onValueChange,
  onRemove,
}: SpecRowProps) {
  const def = SPEC_DEFINITIONS[specKey]
  const isCustom = !def

  return (
    <div className="flex gap-3 items-start p-3 rounded-lg border border-border bg-background group">
      <div className="w-44 shrink-0">
        {isCustom ? (
          <Input
            placeholder="Label (e.g. Weight)"
            value={specKey === "custom" ? "" : specKey}
            onChange={(e) => onKeyChange(e.target.value)}
          />
        ) : (
          <div className="flex h-9 items-center px-3 rounded-md border border-input bg-muted text-sm font-medium text-foreground">
            {def.label}
          </div>
        )}
      </div>

      <div className="flex-1">
        {isCustom ? (
          <Input
            placeholder="Value"
            value={specValue}
            onChange={(e) => onValueChange(e.target.value)}
          />
        ) : (
          <SearchableSelect
            options={def.options}
            value={specValue}
            onChange={onValueChange}
            placeholder={`Select ${def.label}...`}
            allowCustom
          />
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="shrink-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
