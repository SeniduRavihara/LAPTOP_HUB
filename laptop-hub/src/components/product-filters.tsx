'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    type: true,
    brand: true,
    price: true,
    processor: true,
    ram: true,
  })

  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedProcessors, setSelectedProcessors] = useState<string[]>([])
  const [selectedRams, setSelectedRams] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')

  // Initialize filters from URL
  useEffect(() => {
    setSelectedBrands(searchParams.get('brands')?.split(',').filter(Boolean) || [])
    setSelectedTypes(searchParams.get('types')?.split(',').filter(Boolean) || [])
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
    else if (key === 'type') { setSelected = setSelectedTypes; selected = selectedTypes; }
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
    const selected = key === 'brand' ? selectedBrands : 
                     key === 'type' ? selectedTypes : 
                     key === 'processor' ? selectedProcessors : selectedRams;

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
    const params = new URLSearchParams(searchParams.toString())
    
    // Set or delete brand params
    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','))
    else params.delete('brands')
    
    // Set or delete type params
    if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','))
    else params.delete('types')
    
    // Set or delete processor params
    if (selectedProcessors.length > 0) params.set('processors', selectedProcessors.join(','))
    else params.delete('processors')
    
    // Set or delete ram params
    if (selectedRams.length > 0) params.set('rams', selectedRams.join(','))
    else params.delete('rams')
    
    // Set or delete price params
    if (minPrice) params.set('minPrice', minPrice)
    else params.delete('minPrice')
    
    if (maxPrice) params.set('maxPrice', maxPrice)
    else params.delete('maxPrice')

    const queryString = params.toString()
    const url = queryString ? `/products?${queryString}` : '/products'
    router.push(url, { scroll: false })
    router.refresh()
  }

  const handleReset = () => {
    setSelectedBrands([])
    setSelectedTypes([])
    setSelectedProcessors([])
    setSelectedRams([])
    setMinPrice('')
    setMaxPrice('')
    
    // Preserve only the query if it exists
    const query = searchParams.get('query')
    const url = query ? `/products?query=${query}` : '/products'
    
    router.push(url, { scroll: false })
    router.refresh()
  }

  return (
    <div className="bg-card border border-border rounded-lg flex flex-col max-h-[calc(100vh-8rem)]">
      <div className="p-4 pb-2">
        <h3 className="font-semibold text-foreground">Filters</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pt-0">
        {filterSection('Type', ['Standard', 'Auction'])}
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
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full min-w-0 px-2 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>
              <span className="text-muted-foreground flex-shrink-0">-</span>
              <div className="relative flex-1">
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full min-w-0 px-2 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <Button onClick={handleApply} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9 font-medium">
          Apply Filters
        </Button>
        <Button onClick={handleReset} variant="outline" className="w-full mt-2 border border-border bg-background text-foreground hover:bg-secondary rounded-lg h-9">
          Reset
        </Button>
      </div>
    </div>
  )
}
