import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Image from 'next/image'

export default function AboutPage() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'>
			<Navbar />
			
			{/* About TechHub Hero Section */}
			<div className="relative min-h-[400px] flex flex-col items-center justify-center text-center overflow-hidden" style={{background: "url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop') center/cover no-repeat"}}>
				<div className="absolute inset-0 bg-[#0A1E5B]/80" />
				<div className="relative z-10 py-24 w-full flex flex-col items-center justify-center">
					<h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">About TechHub</h1>
					<p className="text-xl text-white/95 max-w-2xl mx-auto">Your Premier Destination for Cutting-Edge Technology</p>
				</div>
			</div>
			
			{/* About Us Section */}
			<div className='container mx-auto px-4 py-8'>
				<div className='flex flex-col lg:flex-row items-start gap-12'>
					{/* Left Side - Content */}
					<div className='lg:w-[60%] space-y-8 animate-slide-in-left'>
						<div className='bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300'>
							<div className='flex items-center gap-3 mb-6'>
								<div className='w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center'>
									<span className='text-white text-2xl'>🏢</span>
								</div>
								<h2 className='text-3xl font-bold text-[#0A1E5B]'>Who We Are</h2>
							</div>
							<p className='text-gray-700 text-lg leading-relaxed mb-4'>
								Welcome to <span className='font-semibold text-[#0A1E5B]'>TechHub</span>, your premier destination for high-quality laptops and computer accessories. 
								We are committed to providing the latest technology solutions to meet all your computing needs.
							</p>
							<p className='text-gray-700 text-lg leading-relaxed'>
								Founded with a passion for technology and customer satisfaction, TechHub has grown to become 
								a trusted name in the laptop retail industry. We offer a carefully curated selection of laptops 
								from leading brands including <span className='font-semibold'>Dell, HP, Lenovo, ASUS, MSI</span>, and more.
							</p>
						</div>

						<div className='bg-gradient-to-br from-[#0A1E5B] to-[#1a3a8a] rounded-2xl p-8 shadow-xl text-white hover:scale-[1.02] transition-transform duration-300'>
							<div className='flex items-center gap-3 mb-6'>
								<div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center'>
									<span className='text-white text-2xl'>🎯</span>
								</div>
								<h2 className='text-3xl font-bold'>Our Mission</h2>
							</div>
							<p className='text-white/95 text-lg leading-relaxed'>
								Our mission is to empower individuals and businesses with the right technology tools. 
								Whether you're a student, professional, gamer, or business owner, we have the perfect 
								laptop solution for you. We pride ourselves on offering competitive prices, excellent 
								customer service, and expert advice.
							</p>
						</div>

						<div className='bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300'>
							<div className='flex items-center gap-3 mb-6'>
								<div className='w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center'>
									<span className='text-white text-2xl'>⭐</span>
								</div>
								<h2 className='text-3xl font-bold text-[#0A1E5B]'>Why Choose Us?</h2>
							</div>
							<ul className='space-y-4'>
								<li className='flex items-start p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200'>
									<div className='w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1'>
										<span className='text-white font-bold text-sm'>✓</span>
									</div>
									<span className='text-gray-700 text-lg'>Wide selection of laptops from top brands</span>
								</li>
								<li className='flex items-start p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200'>
									<div className='w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1'>
										<span className='text-white font-bold text-sm'>✓</span>
									</div>
									<span className='text-gray-700 text-lg'>Competitive pricing and special offers</span>
								</li>
								<li className='flex items-start p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200'>
									<div className='w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1'>
										<span className='text-white font-bold text-sm'>✓</span>
									</div>
									<span className='text-gray-700 text-lg'>Expert customer support and guidance</span>
								</li>
								<li className='flex items-start p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200'>
									<div className='w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1'>
										<span className='text-white font-bold text-sm'>✓</span>
									</div>
									<span className='text-gray-700 text-lg'>Secure online shopping experience</span>
								</li>
								<li className='flex items-start p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200'>
									<div className='w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1'>
										<span className='text-white font-bold text-sm'>✓</span>
									</div>
									<span className='text-gray-700 text-lg'>Fast and reliable shipping</span>
								</li>
								<li className='flex items-start p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200'>
									<div className='w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1'>
										<span className='text-white font-bold text-sm'>✓</span>
									</div>
									<span className='text-gray-700 text-lg'>Warranty and after-sales support</span>
								</li>
							</ul>
						</div>
					</div>

					{/* Right Side - Image */}
					<div className='lg:w-[40%] lg:sticky lg:top-24 animate-slide-in-right'>
						<div className='relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300'>
							<div className='absolute inset-0 bg-gradient-to-t from-[#0A1E5B]/20 to-transparent z-10'></div>
							<Image
								src='./msi-gaming-laptop.jpg'
								alt='Gaming Laptop - TechHub'
								fill
								className='object-cover'
								priority
							/>
						</div>
					</div>
				</div>

				{/* Additional Info Section */}
				<div className='mt-20 grid md:grid-cols-3 gap-8'>
					<div className='group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-2'>
						<div className='w-20 h-20 bg-gradient-to-br from-[#0A1E5B] to-[#1a3a8a] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
							<span className='text-white text-3xl font-bold'>5+</span>
						</div>
						<h3 className='text-2xl font-bold text-[#0A1E5B] mb-3 text-center'>Years of Experience</h3>
						<p className='text-gray-600 text-center leading-relaxed'>Serving customers with quality products and services</p>
						<div className='mt-4 h-1 w-16 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full'></div>
					</div>

					<div className='group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-2'>
						<div className='w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
							<span className='text-white text-3xl font-bold'>1K+</span>
						</div>
						<h3 className='text-2xl font-bold text-[#0A1E5B] mb-3 text-center'>Happy Customers</h3>
						<p className='text-gray-600 text-center leading-relaxed'>Trusted by thousands of satisfied clients</p>
						<div className='mt-4 h-1 w-16 bg-gradient-to-r from-[#0A1E5B] to-[#1a3a8a] mx-auto rounded-full'></div>
					</div>

					<div className='group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-2'>
						<div className='w-20 h-20 bg-gradient-to-br from-[#0A1E5B] to-[#1a3a8a] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
							<span className='text-white text-3xl font-bold'>500+</span>
						</div>
						<h3 className='text-2xl font-bold text-[#0A1E5B] mb-3 text-center'>Products Available</h3>
						<p className='text-gray-600 text-center leading-relaxed'>Wide range of laptops and accessories</p>
						<div className='mt-4 h-1 w-16 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full'></div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	)
}
