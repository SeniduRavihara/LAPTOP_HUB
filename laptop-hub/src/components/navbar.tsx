'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingCart, User, Search, ChevronRight } from 'lucide-react'

export function Navbar() {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('All Categories')
	const [cartCount, setCartCount] = useState(0)
	const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false)

	const ACCESSORIES_MENU = [
		{
			name: 'Components',
			subItems: [
				'Motherboards',
				'VGA Cards',
				'Power Supply',
				'Processors',
				'RAM (Memory)',
				'Computer Casing'
			]
		},
		{ name: 'Bags & Cases' },
		{ name: 'Memory & Storage' },
		{ name: 'Mouse & Keyboards' },
		{ name: 'Battery' },
		{ name: 'Cables' },
		{ name: 'ODD' },
		{ name: 'Headsets' },
		{ name: 'Mouse Mats' },
		{ name: 'Speakers' },
		{ name: 'Thermal Paste' },

		{ name: 'Cooling' },
		{ name: 'Others' },
		{ name: 'Ugreen' },
	]

	useEffect(() => {
		const updateCartCount = () => {
			const savedCart = localStorage.getItem('cart')
			if (savedCart) {
				const cart = JSON.parse(savedCart)
				const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
				setCartCount(count)
			}
		}

		// Initial load
		updateCartCount()

		// Listen for custom event
		window.addEventListener('cart-updated', updateCartCount)
		// Listen for storage changes (cross-tab)
		window.addEventListener('storage', updateCartCount)

		return () => {
			window.removeEventListener('cart-updated', updateCartCount)
			window.removeEventListener('storage', updateCartCount)
		}
	}, [])




	return (
		<nav className='bg-white border-b border-gray-200 sticky top-0 z-50'>
			<div className='w-full px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-20'>
					{/* Logo */}
					<Link href='/' className='flex items-center gap-2 flex-shrink-0'>
						<div className='w-10 h-10 bg-[#0A1E5B] rounded-lg flex items-center justify-center'>
							<span className='text-white font-bold text-lg'>T</span>
						</div>
						<span className='text-xl font-bold text-gray-900'>
							TechHub
						</span>
					</Link>

					{/* Search Bar */}
					<div className='flex-1 max-w-xl ml-8 mr-4 hidden md:flex'>
						<div className='relative w-full flex items-center border-2 border-blue-900 rounded-full overflow-hidden bg-white'>
							<Input
								type='text'
								placeholder='Search Your Products'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='flex-1 pl-6 pr-4 h-10 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0'
							/>
							<div className='flex items-center'>
								<select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className='px-4 h-10 bg-transparent text-gray-700 font-medium cursor-pointer border-0 outline-none appearance-none pr-8 text-sm'
								>
									<option value="all">All Categories</option>
									<option value="laptops">Laptops</option>
									<option value="gaming">Gaming Laptops</option>
									<option value="business">Business Laptops</option>
									<option value="accessories">Accessories</option>
								</select>
								<svg className='w-4 h-4 text-gray-600 absolute right-[110px] pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
								</svg>
							</div>
							<button className='bg-orange-500 hover:bg-orange-600 text-white px-6 h-10 flex items-center justify-center transition-colors'>
								<Search className='w-5 h-5' />
							</button>
						</div>
					</div>

					{/* Right Actions */}
					<div className='flex items-center gap-6'>
						<Link
							href='/auctions'
							className='text-sm font-medium text-gray-700 hover:text-[#0A1E5B] transition-colors hover:underline'
						>
							Auctions
						</Link>



						<div
							className="relative h-full flex items-center"
							onMouseEnter={() => setIsAccessoriesOpen(true)}
							onMouseLeave={() => setIsAccessoriesOpen(false)}
						>
							<Link
								href="/accessories"
								className="text-sm font-medium text-gray-700 hover:text-[#0A1E5B] hover:underline flex items-center h-full"
							>
								Accessories
							</Link>

							{isAccessoriesOpen && (
								<div className="absolute top-[80%] left-0 w-[250px] bg-white shadow-lg border border-gray-100 rounded-md z-50">
									<ul className="flex flex-col py-2">
										<li className="mb-1 pb-1 border-b border-gray-100">
											<Link
												href="/accessories"
												className="flex items-center justify-between px-4 py-2 text-sm font-semibold text-[#0A1E5B] hover:bg-gray-50 transition-colors"
											>
												View All Accessories
											</Link>
										</li>
										{ACCESSORIES_MENU.map((item) => (
											<li key={item.name} className="relative group/item">
												<Link
													href={`/accessories?category=${item.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
													className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors w-full"
												>
													<span>{item.name}</span>
													{(item.subItems || item.name === 'Memory & Storage' || item.name === 'Mouse & Keyboards' || item.name === 'Ugreen') && (
														<ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:text-gray-600" />
													)}
												</Link>

												{/* Nested Sub-menu */}
												{item.subItems && (
													<div className="absolute left-full top-0 w-[200px] bg-white shadow-lg border border-gray-100 rounded-md hidden group-hover/item:block -ml-1">
														<ul className="flex flex-col py-2">
															{item.subItems.map((subItem) => (
																<li key={subItem}>
																	<Link
																		href={`/accessories?category=${item.name.toLowerCase()}&sub=${subItem.toLowerCase().replace(/ /g, '-')}`}
																		className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
																	>
																		{subItem}
																	</Link>
																</li>
															))}
														</ul>
													</div>
												)}
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
						<Link
							href='/about'
							className='text-sm font-medium text-gray-700 hover:text-[#0A1E5B] transition-colors hover:underline'
						>
							About Us
						</Link>
						<Link
							href="/#contact"
							className='text-sm font-medium text-gray-700 hover:text-[#0A1E5B] transition-colors hover:underline'
						>
							Contact Us
						</Link>
						<Link
							href='/cart'
							className='relative text-gray-700 hover:text-[#0A1E5B] transition-all hover:shadow-[0_0_15px_rgba(10,30,91,0.6)] rounded-full p-2'
						>
							<ShoppingCart className='w-6 h-6' />
							{cartCount > 0 && (
								<span className='absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center'>
									{cartCount}
								</span>
							)}
						</Link>
						<Link
							href='/account'
							className='text-gray-700 hover:text-[#0A1E5B] transition-all hover:shadow-[0_0_15px_rgba(10,30,91,0.6)] rounded-full p-2'
						>
							<User className='w-6 h-6' />
						</Link>
						<Link href='/login'>
							<Button
								variant="outline"

								className='border-[#0A1E5B] text-[#0A1E5B] hover:[#0A1E5B]/90 rounded-lg h-10 px-6'
							>
								Sign In
							</Button>
						</Link>
						<Link href='/seller/dashboard'>
							<Button className='bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white rounded-lg h-10 px-6'>
								Sell Now
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	)
}
