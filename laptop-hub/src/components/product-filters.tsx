'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function ProductFilters() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brand: true,
    price: true,
    processor: true,
    ram: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const filterSection = (title: string, items: string[]) => (
    <div key={title} className="border-b border-border py-4">
      <button
        onClick={() => toggleSection(title.toLowerCase())}
        className="flex items-center justify-between w-full text-sm font-semibold text-foreground mb-3 hover:text-primary transition-colors"
      >
        {title}
        <svg
          className={`w-4 h-4 transition-transform ${expandedSections[title.toLowerCase()] ? '' : '-rotate-90'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
      {expandedSections[title.toLowerCase()] && (
        <div className="space-y-2">
          {items.map(item => (
            <label key={item} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border cursor-pointer"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {item}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-fit">
      <h3 className="font-semibold text-foreground mb-4">Filters</h3>

      {filterSection('Brand', ['Dell', 'HP', 'Lenovo', 'Apple', 'ASUS', 'MSI'])}
      {filterSection('Processor', ['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1'])}
      {filterSection('RAM', ['8GB', '16GB', '32GB', '64GB+'])}

      <div className="border-b border-border py-4">
        <label className="block text-sm font-semibold text-foreground mb-3">Price Range</label>
        <div className="space-y-3">
          <input type="range" min="500" max="3000" className="w-full" />
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            <span className="text-muted-foreground">-</span>
            <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>
        </div>
      </div>

      <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9 font-medium">
        Apply Filters
      </Button>
      <Button variant="outline" className="w-full mt-2 border border-border bg-background text-foreground hover:bg-secondary rounded-lg h-9">
        Reset
      </Button>
    </div>
  )
}
