'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brand: true,
    price: true,
    processor: true,
    ram: true,
  })

  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedProcessors, setSelectedProcessors] = useState<string[]>([])
  const [selectedRams, setSelectedRams] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')

  // Initialize filters from URL
  useEffect(() => {
    setSelectedBrands(searchParams.get('brands')?.split(',').filter(Boolean) || [])
    setSelectedProcessors(searchParams.get('processors')?.split(',').filter(Boolean) || [])
    setSelectedRams(searchParams.get('rams')?.split(',').filter(Boolean) || [])
    setMinPrice(searchParams.get('minPrice') || '')
    setMaxPrice(searchParams.get('maxPrice') || '')
  }, [searchParams])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleCheckboxChange = (title: string, item: string) => {
    const key = title.toLowerCase()
    let setSelected: React.Dispatch<React.SetStateAction<string[]>>
    let selected: string[]

    if (key === 'brand') { setSelected = setSelectedBrands; selected = selectedBrands; }
    else if (key === 'processor') { setSelected = setSelectedProcessors; selected = selectedProcessors; }
    else if (key === 'ram') { setSelected = setSelectedRams; selected = selectedRams; }
    else return;

    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item))
    } else {
      setSelected([...selected, item])
    }
  }

  const filterSection = (title: string, items: string[]) => {
    const key = title.toLowerCase();
    const selected = key === 'brand' ? selectedBrands : key === 'processor' ? selectedProcessors : selectedRams;

    return (
      <div key={title} className="border-b border-border py-4">
        <button
          onClick={() => toggleSection(key)}
          className="flex items-center justify-between w-full text-sm font-semibold text-foreground mb-3 hover:text-primary transition-colors"
        >
          {title}
          <svg
            className={`w-4 h-4 transition-transform ${expandedSections[key] ? '' : '-rotate-90'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
        {expandedSections[key] && (
          <div className="space-y-2">
            {items.map(item => (
              <label key={item} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selected.includes(item)}
                  onChange={() => handleCheckboxChange(title, item)}
                  className="w-4 h-4 rounded border-border cursor-pointer text-primary focus:ring-primary"
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
  }

  const handleApply = () => {
    const params = new URLSearchParams()
    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','))
    if (selectedProcessors.length > 0) params.set('processors', selectedProcessors.join(','))
    if (selectedRams.length > 0) params.set('rams', selectedRams.join(','))
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    const queryString = params.toString()
    const url = queryString ? `/?${queryString}#products` : '/#products'
    router.push(url, { scroll: false })
    router.refresh()
  }

  const handleReset = () => {
    setSelectedBrands([])
    setSelectedProcessors([])
    setSelectedRams([])
    setMinPrice('')
    setMaxPrice('')
    router.push(`/#products`, { scroll: false })
    router.refresh()
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-fit">
      <h3 className="font-semibold text-foreground mb-4">Filters</h3>

      {filterSection('Brand', ['Dell', 'HP', 'Lenovo', 'Apple', 'ASUS', 'MSI'])}
      {filterSection('Processor', ['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1'])}
      {filterSection('RAM', ['8GB', '16GB', '32GB', '64GB+'])}

      <div className="border-b border-border py-4">
        <label className="block text-sm font-semibold text-foreground mb-3">Price Range</label>
        <div className="space-y-3">
          <input 
            type="range" 
            min="0" 
            max="5000" 
            value={maxPrice || '5000'}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full accent-primary" 
          />
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Min" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background" 
            />
            <span className="text-muted-foreground py-2">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background" 
            />
          </div>
        </div>
      </div>

      <Button onClick={handleApply} className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9 font-medium">
        Apply Filters
      </Button>
      <Button onClick={handleReset} variant="outline" className="w-full mt-2 border border-border bg-background text-foreground hover:bg-secondary rounded-lg h-9">
        Reset
      </Button>
    </div>
  )
}
