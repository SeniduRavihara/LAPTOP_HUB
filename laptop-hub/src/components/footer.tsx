import Link from 'next/link'

export function Footer() {
	return (
		<footer className="bg-[#0A1E5B] text-white mt-0 border-t-4 border-red-600 relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
					{/* Contact Info */}
					<div className="md:col-span-1">
						<div className="flex items-center gap-3 mb-6">
							<svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
							</svg>
						</div>
						<p className="text-sm text-gray-300 mb-4">We are Here! 24/7 Customer Support</p>
						<div className="space-y-2 mb-6">
							<p className="text-lg font-semibold text-red-500">+94 111 555 888</p>
							<p className="text-lg font-semibold text-gray-400">+94 444 555 666</p>
						</div>
						<div className="mb-6">
							<p className="text-sm font-semibold mb-2">TechHub (Pvt) Ltd.</p>
							<p className="text-sm text-gray-400">#40,Sri Jayewardenepura Kotte. Sri Lanka.</p>
						</div>
						<div className="mb-6">
							<p className="text-sm font-semibold mb-1">Technical Support:</p>
							<p className="text-sm text-gray-400">+94 111 200 222</p>
						</div>
						<div className="flex gap-4">
							<a href="#" className="text-gray-400 hover:text-white transition-colors">
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
								</svg>
							</a>
							<a href="#" className="text-gray-400 hover:text-white transition-colors">
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
								</svg>
							</a>
							<a href="#" className="text-gray-400 hover:text-white transition-colors">
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
								</svg>
							</a>
						</div>
					</div>

					{/* Top Brands */}
					<div>
						<h3 className="font-semibold mb-4 text-lg">Top Brands</h3>
						<ul className="space-y-2 text-sm text-gray-300">
							<li><Link href="#" className="hover:text-white transition-colors">Apple</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Asus</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Dell</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">HP</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Lenovo</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">MSI</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Acer</Link></li>
						</ul>
					</div>

					{/* Find It Fast */}
					<div>
						<h3 className="font-semibold mb-4 text-lg">Find It Fast</h3>
						<ul className="space-y-2 text-sm text-gray-300">
							<li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
							<li><Link href="/auctions" className="hover:text-white transition-colors">Auctions</Link></li>
							<li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Our Products</Link></li>
							
							<li><Link href="/#contact" className="hover:text-white transition-colors">Contact Us</Link></li>
						</ul>
					</div>

					{/* Laptops */}
					<div>
						<h3 className="font-semibold mb-4 text-lg">Laptops</h3>
						<ul className="space-y-2 text-sm text-gray-300">
							<li><Link href="#" className="hover:text-white transition-colors">Apple Macbook</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">AMD Laptops</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Intel Celeron</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Core i3 Laptops</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Core i5 Laptops</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Core i7 Laptops</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Gaming Laptops</Link></li>
						</ul>
					</div>

					{/* Accessories */}
					<div>
						<h3 className="font-semibold mb-4 text-lg">Accessories</h3>
						<ul className="space-y-2 text-sm text-gray-300">
							<li><Link href="#" className="hover:text-white transition-colors">Pendrive</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Headset</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Bags & Cases</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Mouse & Keyboards</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Virusgaurds</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">Mouse Mat</Link></li>
							<li><Link href="#" className="hover:text-white transition-colors">External HDD</Link></li>
						</ul>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p className="text-sm text-gray-400 mb-4 md:mb-0">
						Copyright © 2025 TechHub.lk. All rights reserved.
					</p>
					<div className="flex gap-2">
						<img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-8 bg-white rounded px-2 py-1" />
						<img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 bg-white rounded px-2 py-1" />
						<img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-8 bg-white rounded px-2 py-1" />
					</div>
				</div>
			</div>
		</footer>
	)
}
