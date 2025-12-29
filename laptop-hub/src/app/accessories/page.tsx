'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { ShoppingCart, Star, Filter } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

// Mock Data for Accessories
const ACCESSORIES = [
    {
        id: 101,
        name: "Logitech MX Master 3S",
        brand: "Logitech",
        price: 99.99,
        category: "Mice",
        rating: 4.8,
        reviews: 2450,
        image: "/placeholder.svg?key=mouse"
    },
    {
        id: 102,
        name: "Keychron K2 Pro Mechanical Keyboard",
        brand: "Keychron",
        price: 89.99,
        category: "Keyboards",
        rating: 4.9,
        reviews: 890,
        image: "/placeholder.svg?key=keyboard"
    },
    {
        id: 103,
        name: "Sony WH-1000XM5 Headphones",
        brand: "Sony",
        price: 348.00,
        category: "Headphones",
        rating: 4.7,
        reviews: 1200,
        image: "/placeholder.svg?key=headphones"
    },
    {
        id: 104,
        name: "Samsung T7 Shield 2TB SSD",
        brand: "Samsung",
        price: 159.99,
        category: "Storage",
        rating: 4.9,
        reviews: 3100,
        image: "/placeholder.svg?key=ssd"
    },
    {
        id: 105,
        name: "Razer DeathAdder V3 Pro",
        brand: "Razer",
        price: 149.99,
        category: "Mice",
        rating: 4.6,
        reviews: 950,
        image: "/placeholder.svg?key=razer"
    },
    {
        id: 106,
        name: "Anker USB-C Hub 7-in-1",
        brand: "Anker",
        price: 34.99,
        category: "Cables & Hubs",
        rating: 4.5,
        reviews: 5400,
        image: "/placeholder.svg?key=hub"
    }
]

export default function AccessoriesPage() {
    const [items, setItems] = useState(ACCESSORIES)
    const [filteredItems, setFilteredItems] = useState(ACCESSORIES)
    const [sortBy, setSortBy] = useState('name')
    const [priceRange, setPriceRange] = useState([0, 500])
    const [localPriceRange, setLocalPriceRange] = useState([0, 500])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedBrands, setSelectedBrands] = useState<string[]>([])
    const { toast } = useToast()

    // Derive unique options
    const uniqueCategories = Array.from(new Set(ACCESSORIES.map(item => item.category))).sort()
    const uniqueBrands = Array.from(new Set(ACCESSORIES.map(item => item.brand))).sort()

    // Handle Filtering and Sorting
    useEffect(() => {
        let result = [...ACCESSORIES]

        // Filter by Price
        result = result.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1])

        // Filter by Category
        if (selectedCategories.length > 0) {
            result = result.filter(item => selectedCategories.includes(item.category))
        }

        // Filter by Brand
        if (selectedBrands.length > 0) {
            result = result.filter(item => selectedBrands.includes(item.brand))
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name)
            } else if (sortBy === 'brand') {
                return a.brand.localeCompare(b.brand)
            } else if (sortBy === 'price-low') {
                return a.price - b.price
            } else if (sortBy === 'price-high') {
                return b.price - a.price
            }
            return 0
        })

        setFilteredItems(result)
    }, [sortBy, priceRange, selectedCategories, selectedBrands])

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        )
    }

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        )
    }

    const addToCart = (product: any) => {
        const savedCart = localStorage.getItem('cart')
        let cart = savedCart ? JSON.parse(savedCart) : []

        // Check if item already exists
        const existingItemIndex = cart.findIndex((item: any) => item.id === product.id)

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            })
        }

        localStorage.setItem('cart', JSON.stringify(cart))

        // Dispatch custom event to update Navbar
        window.dispatchEvent(new Event('cart-updated'))

        toast({
            title: "Added to Cart",
            description: `${product.name} has been added to your cart.`,
        })
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />


            {/* Hero Section */}
            <div className="relative bg-[#050B20] text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A1E5B]/90 via-[#0A1E5B]/80 to-[#0A1E5B]/90 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-30 grayscale mix-blend-overlay" />

                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Computer Accessories</h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-light">
                        Upgrade your setup with premium peripherals from top brands
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls Bar */}
                <div className="flex justify-end items-center mb-8">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Name (A-Z)</SelectItem>
                                <SelectItem value="brand">Brand (A-Z)</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filter Sidebar */}
                    <div className="lg:col-span-1 h-fit sticky top-24">
                        <div className="bg-card border border-border rounded-lg p-6">
                            <div className="flex items-center gap-2 font-semibold text-lg mb-6 text-foreground">
                                <Filter className="w-5 h-5" />
                                Filters
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium mb-4 text-foreground">Filter by price</h3>
                                    <Slider
                                        defaultValue={[0, 500]}
                                        max={500}
                                        step={10}
                                        value={localPriceRange}
                                        onValueChange={setLocalPriceRange}
                                        className="mb-4"
                                    />
                                    <div className="flex justify-between items-center text-sm mb-4">
                                        <span className="text-muted-foreground">Price: </span>
                                        <span className="font-medium text-foreground">
                                            ${localPriceRange[0]} — ${localPriceRange[1]}
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="w-full bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
                                        onClick={() => setPriceRange(localPriceRange)}
                                    >
                                        Filter
                                    </Button>
                                </div>

                                <Button
                                    variant="secondary"
                                    className="w-full mt-4"
                                    onClick={() => {
                                        setPriceRange([0, 500])
                                        setLocalPriceRange([0, 500])
                                        setSelectedCategories([])
                                        setSelectedBrands([])
                                    }}
                                >
                                    Reset Filters
                                </Button>

                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-medium mb-4 text-foreground">Categories</h3>
                                    <div className="space-y-3">
                                        {uniqueCategories.map(category => (
                                            <div key={category} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`category-${category}`}
                                                    checked={selectedCategories.includes(category)}
                                                    onCheckedChange={() => toggleCategory(category)}
                                                />
                                                <label
                                                    htmlFor={`category-${category}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {category}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-medium mb-4 text-foreground">Brands</h3>
                                    <div className="space-y-3">
                                        {uniqueBrands.map(brand => (
                                            <div key={brand} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`brand-${brand}`}
                                                    checked={selectedBrands.includes(brand)}
                                                    onCheckedChange={() => toggleBrand(brand)}
                                                />
                                                <label
                                                    htmlFor={`brand-${brand}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {brand}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map((product) => (
                                <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                                    <div className="relative aspect-square bg-secondary">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <div className="text-xs text-muted-foreground mb-1">{product.brand}</div>
                                        <h3 className="font-semibold text-foreground leading-tight mb-2 h-10 line-clamp-2">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-center mb-3">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-xs font-medium ml-1">{product.rating}</span>
                                            <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="text-lg font-bold text-primary">${product.price.toFixed(2)}</div>
                                            <Button
                                                size="sm"
                                                onClick={() => addToCart(product)}
                                                className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredItems.length === 0 && (
                                <div className="col-span-full py-12 text-center">
                                    <p className="text-muted-foreground text-lg">No products found in this price range.</p>
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            setPriceRange([0, 500])
                                            setLocalPriceRange([0, 500])
                                        }}
                                        className="mt-2 text-accent"
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
