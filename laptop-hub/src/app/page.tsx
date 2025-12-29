'use client'

import { Navbar } from '@/components/navbar'
import { ProductFilters } from '@/components/product-filters'
import { ProductCard } from '@/components/product-card'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const featuredProducts = [
	{
		id: '1',
		name: 'Dell XPS 13 Plus Laptop - 13.4" FHD Display, Intel Core i7, 16GB RAM',
		brand: 'Dell',
		price: 1299,
		image: '/dell-xps-13-laptop.jpg',
		rating: 4.8,
		reviews: 328,
		stock: 5,
		badge: 'Best Seller',
	},
	{
		id: '2',
		name: 'HP Pavilion 15 Laptop - 15.6" HD Display, AMD Ryzen 5, 8GB RAM',
		brand: 'HP',
		price: 549,
		image: '/hp-pavilion-laptop.jpg',
		rating: 4.5,
		reviews: 156,
		stock: 12,
	},
	{
		id: '3',
		name: 'MacBook Air M2 - 13.6" Retina Display, 8-core GPU, 256GB SSD',
		brand: 'Apple',
		price: 1199,
		image: '/macbook-air-m2.png',
		rating: 4.9,
		reviews: 412,
		stock: 3,
		badge: 'New',
	},
	{
		id: '4',
		name: 'Lenovo ThinkPad E14 Gen 5 - 14" FHD, Intel Core i5, 16GB RAM',
		brand: 'Lenovo',
		price: 699,
		image: '/lenovo-thinkpad.png',
		rating: 4.6,
		reviews: 203,
		stock: 8,
	},
	{
		id: '5',
		name: 'ASUS ROG Gaming Laptop - 15.6" 165Hz, RTX 4060, Intel i7-12K',
		brand: 'ASUS',
		price: 1599,
		image: '/asus-rog-gaming-laptop.jpg',
		rating: 4.7,
		reviews: 289,
		stock: 6,
		badge: 'Hot Deal',
	},
	{
		id: '6',
		name: 'Microsoft Surface Laptop 5 - 13.5" Touch, Intel Core i5, 8GB RAM',
		brand: 'Microsoft',
		price: 999,
		image: '/microsoft-surface-laptop.jpg',
		rating: 4.4,
		reviews: 127,
		stock: 0,
	},
	{
		id: '7',
		name: 'MSI GF63 Thin Gaming Laptop - 15.6" 144Hz, RTX 4050, Ryzen 7',
		brand: 'MSI',
		price: 899,
		image: '/msi-gaming-laptop.jpg',
		rating: 4.5,
		reviews: 178,
		stock: 10,
	},
	{
		id: '8',
		name: 'Acer Aspire 5 Laptop - 15.6" FHD, Intel Core i5, 16GB RAM',
		brand: 'Acer',
		price: 599,
		image: '/acer-aspire-laptop.jpg',
		rating: 4.3,
		reviews: 95,
		stock: 14,
	},
	{
		id: '9',
		name: 'HP Envy x360 Laptop - 15.6" 2K Touch, Intel Core i7, 16GB RAM',
		brand: 'HP',
		price: 1099,
		image: '/hp-envy-laptop.jpg',
		rating: 4.6,
		reviews: 142,
		stock: 7,
		badge: 'Popular',
	},
]

export default function HomePage() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [activeFilter, setActiveFilter] = useState<'all' | 'premium' | 'gaming'>('all')
	const totalSlides = 4

	const handleFilter = (filter: 'premium' | 'gaming') => {
		setActiveFilter(filter)
		const productsSection = document.getElementById('products')
		if (productsSection) {
			productsSection.scrollIntoView({ behavior: 'smooth' })
		}
	}

	const filteredProducts = featuredProducts.filter(product => {
		if (activeFilter === 'premium') return product.price >= 1000
		if (activeFilter === 'gaming') return product.name.toLowerCase().includes('gaming')
		return true
	})

	// Auto-rotate carousel every 5 seconds
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % totalSlides)
		}, 5000)
		return () => clearInterval(timer)
	}, [])

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % totalSlides)
	}

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
	}

	const goToSlide = (index: number) => {
		setCurrentSlide(index)
	}

	return (
		<main className="min-h-screen bg-background">
			<Navbar />

			{/* Hero Section */}
			<section className="relative overflow-hidden border-b border-border">
				{/* Video Background */}



				<div
					className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
					style={{ backgroundImage: "url('/asus-rog-gaming-laptop.jpg')" }}
				></div>

				{/* Overlay to darken video */}
				<div className="absolute inset-0 bg-black/50"></div>

				{/* Content */}
				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
					<div className="flex flex-col md:flex-row items-center justify-between gap-8">
						<div className="max-w-xl text-left">
							<h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
								Powerful & Sleek<br />Laptops
							</h1>
							<p className="text-lg md:text-xl text-white/90 mb-6">
								Find the perfect laptop<br />for education, gaming, and more!
							</p>
							<Link
								href="#products"
								className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
							>
								Shop Now
							</Link>
							<p className="text-sm text-white/80 mt-4">
								Limited Time Offers • Free Shipping
							</p>
						</div>

						{/* Laptop Images on the right */}
						<div className="hidden md:flex flex-col gap-4">
							<div
								onClick={() => handleFilter('premium')}
								className="relative w-[280px] h-[180px] rounded-xl border border-white/20 shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer"
							>
								{/* Background Image */}
								<div
									className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
									style={{ backgroundImage: "url('/macbook-air-m2.png')" }}
								/>
								{/* Overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
								<div className="absolute bottom-0 left-0 right-0 p-4">
									<p className="text-white text-sm font-semibold"> Our Premium Collection</p>
									<p className="text-xs text-white/70">Flagship Devices</p>
								</div>
							</div>
							<div
								onClick={() => handleFilter('gaming')}
								className="relative w-[280px] h-[180px] rounded-xl border border-white/20 shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer"
							>
								{/* Background Image */}
								<div
									className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
									style={{ backgroundImage: "url('/msi-gaming-laptop.jpg')" }}
								/>
								{/* Overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
								<div className="absolute bottom-0 left-0 right-0 p-4">
									<p className="text-white text-sm font-semibold"> Our Gaming Series</p>
									<p className="text-xs text-white/70">High Performance</p>
								</div>
							</div>
						</div>
					</div>

					{/* Feature Badges at Bottom */}
					<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-12 text-white">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
							</div>
							<span className="font-semibold">Top Brands</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<span className="font-semibold">Best Deals</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<span className="font-semibold">Fast Delivery</span>
						</div>
					</div>
				</div>
			</section>

			{/* Advertisement Banner Section */}
			<section className="w-full bg-background py-10 border-b border-border">
				<div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
					<div className="relative overflow-hidden rounded-2xl">
						{/* Banner Carousel */}
						<div
							className="flex transition-transform duration-500 ease-in-out"
							style={{ transform: `translateX(-${currentSlide * 100}%)` }}
						>
							{/* Lenovo IdeaPad Banner */}
							<div className="min-w-full relative h-[300px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
								<div className="absolute inset-0 flex items-center justify-between px-12">
									<div className="text-white space-y-3">
										<div className="flex items-center gap-2">
											<span className="text-sm font-semibold tracking-wide">Lenovo</span>
										</div>
										<h2 className="text-5xl font-bold mb-2">
											IdeaPad 1
										</h2>
										<p className="text-3xl font-light italic">Budget friendly</p>
										<div className="flex gap-6 text-sm mt-3">
											<div className="font-bold">AMD Ryzen 3 7320U Processor</div>
											<div className="font-bold">512GB M.2 NVMe SSD</div>
										</div>
										<div className="flex gap-6 text-sm">
											<div className="font-bold">16GB LPDDR5 RAM</div>
											<div className="font-bold">15.6" FHD Display</div>
										</div>
										<div className="text-sm font-bold">AMD Radeon 610M Graphics</div>
									</div>
									<div className="relative">
										<div className="absolute -top-8 -right-8 bg-red-600 text-white px-4 py-2 text-sm font-bold rounded z-10">
											NEW<br />ARRIVALS
										</div>
										<div className="w-[400px] h-[200px] bg-slate-700/30 rounded-2xl flex items-center justify-center border border-slate-600/30">
											<svg className="w-48 h-48 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
											</svg>
										</div>
										<div className="absolute top-2 right-2 text-red-600 font-bold text-2xl">
											Lenovo
										</div>
									</div>
								</div>

							</div>

							{/* MSI Summit Banner */}
							<div className="min-w-full relative h-[300px] bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900">
								<div className="absolute inset-0 flex items-center justify-between px-12">
									<div className="text-white space-y-3">
										<p className="text-sm font-semibold tracking-wide">New Amplify AI Power 2 in 1 - Ultra 7</p>
										<h2 className="text-5xl font-bold mb-2">
											Summit 16 AI Evo A2HM
										</h2>
										<p className="text-2xl font-light">Determined to Succeed</p>
										<div className="mt-4">
											<div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm">
												FREE!
											</div>
										</div>
										<div className="flex items-center gap-4 mt-4">
											<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
												<rect x="2" y="3" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
												<path d="M8 10h8M8 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
											</svg>
											<span className="text-xs">Windows 11</span>
										</div>
									</div>
									<div className="relative">
										<div className="absolute -top-8 -right-8 bg-red-600 text-white px-4 py-2 text-sm font-bold rounded z-10">
											NEW<br />ARRIVAL
										</div>
										<div className="w-[450px] h-[200px] bg-blue-800/30 rounded-2xl flex items-center justify-center border border-blue-600/30 relative">
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="w-32 h-32 rounded-full bg-blue-500/30 flex items-center justify-center">
													<span className="text-6xl font-bold text-blue-300">AI</span>
												</div>
											</div>
										</div>
										<div className="absolute top-2 right-2 font-bold text-2xl text-white">
											MSI
										</div>
									</div>
								</div>

							</div>

							{/* ASUS TUF Gaming Banner */}
							<div className="min-w-full relative h-[300px] bg-gradient-to-r from-orange-950 via-orange-900 to-red-950">
								<div className="absolute inset-0 flex items-center justify-between px-12">
									<div className="text-white space-y-3">
										<p className="text-sm font-light italic">best gaming experience</p>
										<h2 className="text-5xl font-bold mb-2">
											ASUS TUF GAMING A16
										</h2>
										<p className="text-xl font-semibold text-orange-400">EXPANSIVE IMMERSION. MECHANIZED PERFORMANCE.</p>
										<div className="grid grid-cols-2 gap-4 text-sm mt-3">
											<div>
												<div className="font-bold text-orange-400">AMD RYZEN 7 7445HS</div>
												<div className="text-xs">PROCESSOR</div>
											</div>
											<div>
												<div className="font-bold text-orange-400">512GB NVME</div>
												<div className="text-xs">M.2 SSD</div>
											</div>
											<div>
												<div className="font-bold text-orange-400">16GB DDR5</div>
												<div className="text-xs">RAM</div>
											</div>
											<div>
												<div className="font-bold text-orange-400">16" WUXGA IPS</div>
												<div className="text-xs">DISPLAY</div>
											</div>
										</div>
									</div>
									<div className="relative">
										<div className="absolute -top-8 -right-8 bg-red-600 text-white px-4 py-2 text-sm font-bold rounded z-10">
											NEW<br />ARRIVAL
										</div>
										<div className="w-[400px] h-[200px] bg-orange-900/30 rounded-2xl flex items-center justify-center border border-orange-600/30 relative">
											<div className="text-8xl font-bold text-orange-600/50">TUF</div>
										</div>
										<div className="absolute bottom-4 right-4 flex gap-2">
											<div className="bg-orange-600 px-3 py-1 rounded">
												<span className="text-xs font-bold">AMD RYZEN</span>
											</div>
											<div className="bg-green-600 px-3 py-1 rounded">
												<span className="text-xs font-bold">GEFORCE RTX</span>
											</div>
										</div>
										<div className="absolute bottom-4 left-4">
											<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
												<rect x="2" y="3" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
												<path d="M8 10h8M8 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
											</svg>
											<span className="text-xs">Windows 11</span>
										</div>
										<div className="absolute top-2 right-2 font-bold text-3xl text-white">
											ASUS
										</div>
									</div>
								</div>

							</div>

							{/* Gaming Banner - MSI */}
							<div className="min-w-full relative h-[300px] bg-gradient-to-r from-purple-950 via-purple-900 to-pink-950">
								<div className="absolute inset-0 flex items-center justify-between px-12">
									<div className="text-white space-y-3 max-w-xl">
										<p className="text-xl tracking-widest font-light">PLAY WITH POWER</p>
										<h2 className="text-7xl font-bold tracking-wider">
											<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400">
												GAMING
											</span>
										</h2>
										<p className="text-3xl font-light italic">never ever give up</p>
										<div className="grid grid-cols-2 gap-4 text-sm mt-4">
											<div>
												<div className="font-bold text-yellow-400">Intel Core i7-13700H</div>
												<div className="text-xs">PROCESSOR</div>
											</div>
											<div>
												<div className="font-bold text-yellow-400">NVIDIA RTX 4060</div>
												<div className="text-xs">GRAPHICS</div>
											</div>
											<div>
												<div className="font-bold text-yellow-400">32GB DDR5</div>
												<div className="text-xs">RAM</div>
											</div>
											<div>
												<div className="font-bold text-yellow-400">165Hz Display</div>
												<div className="text-xs">REFRESH RATE</div>
											</div>
										</div>
									</div>
									<div className="relative">
										<div className="w-[450px] h-[250px] bg-gradient-to-br from-purple-800/30 to-pink-800/30 rounded-2xl flex items-center justify-center border border-purple-600/30 relative overflow-hidden">
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="text-9xl font-black text-purple-600/20">MSI</div>
											</div>
											<div className="relative z-10">
												<svg className="w-56 h-56 text-purple-300/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
												</svg>
											</div>
										</div>
										<div className="absolute bottom-4 right-4 flex gap-2">
											<div className="bg-gradient-to-r from-red-600 to-orange-600 px-3 py-1 rounded">
												<span className="text-xs font-bold">RTX 4060</span>
											</div>
											<div className="bg-blue-600 px-3 py-1 rounded">
												<span className="text-xs font-bold">Intel i7</span>
											</div>
										</div>
									</div>
								</div>

							</div>
						</div>

						{/* Navigation Arrows */}
						<button
							onClick={prevSlide}
							className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all z-20"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
						</button>
						<button
							onClick={nextSlide}
							className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all z-20"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</button>

						{/* Dots Navigation */}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
							{[0, 1, 2, 3].map((index) => (
								<button
									key={index}
									onClick={() => goToSlide(index)}
									className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
										}`}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Products Section */}
			<section
				id="products"
				className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
			>
				<div className="flex flex-col lg:flex-row gap-6">
					{/* Sidebar Filters */}
					<aside className="lg:w-80 flex-shrink-0">
						<ProductFilters />
					</aside>

					{/* Products Grid */}
					<div className="flex-1">
						<div className="mb-6 flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-bold text-foreground">
									{activeFilter === 'all' ? 'All Laptops' : activeFilter === 'premium' ? 'Premium Collection' : 'Gaming Series'}
								</h2>
								<div className="flex items-center gap-2">
									<p className="text-sm text-muted-foreground">
										Showing {filteredProducts.length} products
									</p>
									{activeFilter !== 'all' && (
										<button
											onClick={() => setActiveFilter('all')}
											className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground px-2 py-1 rounded transition-colors"
										>
											Clear Filter
										</button>
									)}
								</div>
							</div>
							<select className="border border-border bg-background rounded-lg px-4 py-2 text-sm text-foreground cursor-pointer">
								<option>Most Popular</option>
								<option>Newest</option>
								<option>Price: Low to High</option>
								<option>Price: High to Low</option>
								<option>Best Rating</option>
							</select>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredProducts.map((product) => (
								<ProductCard key={product.id} {...product} />
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Contact Us Section */}
			<section id="contact" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
				<div className="relative bg-gradient-to-r from-[#0A1E5B] via-[#1a3a8a] to-[#0A1E5B] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[400px]">
					<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
					<div className="absolute inset-0 bg-black/40" />
					<div className="relative z-10 flex-1 flex flex-col items-start justify-center p-10">
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">Contact Us</h2>
						<p className="text-lg text-white/90 mb-6 max-w-lg">Have questions, need support, or want to partner with us? Reach out and our team will get back to you as soon as possible.</p>
						<div className="space-y-2 text-white/90">
							<div className="flex items-center gap-3">
								<svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" /></svg>
								<span>info@techhub.com</span>
							</div>
							<div className="flex items-center gap-3">
								<svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" /></svg>
								<span>+1 (555) 123-4567</span>
							</div>
							<div className="flex items-center gap-3">
								<svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" /></svg>
								<span>123 TechHub Ave, Silicon City</span>
							</div>
						</div>
					</div>
					<form className="relative z-10 flex-1 flex flex-col items-center justify-center p-10 w-full md:w-auto">
						<div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-4 border border-white/30">
							<input type="text" placeholder="Your Name" className="rounded-lg px-4 py-3 bg-white/5 text-white placeholder:text-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400" />
							<input type="email" placeholder="Your Email" className="rounded-lg px-4 py-3 bg-white/5 text-white placeholder:text-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400" />
							<textarea placeholder="Your Message" rows={3} className="rounded-lg px-4 py-3 bg-white/5 text-white placeholder:text-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
							<button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md">Send Message</button>
						</div>
					</form>
				</div>
			</section>

			<Footer />
		</main>
	)
}
