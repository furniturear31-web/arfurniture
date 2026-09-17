export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MessageCircle, CheckCircle2, MapPin } from 'lucide-react'
import Image from 'next/image'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: categories } = await supabase.from('categories').select('*').eq('is_active', true).order('name')
  
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, product_images(image_url)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(8)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-zinc-900 text-white min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/home_hero.webp"
            alt="AR Furniture Premium Living Room"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Crafting Your <span className="text-amber-500">Dream Spaces</span> With Elegance.
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl">
              Discover Vadodara's most premium collection of modern, bespoke, and ready-made furniture designed for luxury and comfort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-4 rounded-md text-center transition-colors">
                Explore Collection
              </Link>
              <a href="https://wa.me/918511939151" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-zinc-900 hover:bg-zinc-100 font-semibold px-8 py-4 rounded-md text-center transition-colors">
                Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Shop by Category</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories?.sort((a, b) => {
              const order = ['sofa', 'bed', 'sofa-cum-bed', 'chair', 'dining', 'wardrobe', 'tv-unit', 'office-furniture']
              const indexA = order.indexOf(a.slug)
              const indexB = order.indexOf(b.slug)
              if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name)
              if (indexA === -1) return 1
              if (indexB === -1) return -1
              return indexA - indexB
            }).map(category => (
              <Link key={category.id} href={`/shop?category=${category.slug}`} className="group block text-center">
                <div className="aspect-square bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden mb-4 relative transition-transform group-hover:-translate-y-1 group-hover:shadow-md">
                   {category.image_url ? (
                     <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">No Image</div>
                   )}
                </div>
                <h3 className="font-semibold text-zinc-800 group-hover:text-amber-600 transition-colors">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Featured Collection</h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full" />
            </div>
            <Link href="/shop" className="hidden md:block text-amber-600 font-medium hover:underline">
              View All Products &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {featuredProducts?.map(product => {
              const mainImage = product.product_images?.find((img: any) => img.is_main) || product.product_images?.[0]
              const hoverImage = product.product_images?.find((img: any) => !img.is_main) || product.product_images?.[1]
              
              return (
                <div key={product.id} className="group flex flex-col bg-white rounded-xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-lg transition-shadow">
                  <Link href={`/product/${product.slug}`} className="aspect-[4/3] sm:aspect-square relative overflow-hidden bg-zinc-100">
                    {mainImage ? (
                      <>
                        <img 
                          src={mainImage.image_url} 
                          alt={product.name} 
                          className={`w-full h-full object-cover transition-all duration-500 ${hoverImage && hoverImage !== mainImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                        />
                        {hoverImage && hoverImage !== mainImage && (
                          <img 
                            src={hoverImage.image_url} 
                            alt={`${product.name} alternate view`} 
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105" 
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">No Image</div>
                    )}
                  </Link>
                  <div className="p-3 sm:p-5 flex flex-col flex-grow">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-semibold text-sm sm:text-lg text-zinc-900 line-clamp-1 mb-1 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-center justify-between mt-auto pt-2 sm:pt-0">
                      {product.price ? (
                        <span className="font-bold text-base sm:text-lg text-zinc-900">₹{product.price.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="font-medium text-xs sm:text-sm text-amber-600">On Request</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/shop" className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700 transition-colors">
              View All Products <span className="ml-2">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* AR Furniture Promise Section */}
      <section className="py-20 bg-zinc-950 text-zinc-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The AR Furniture Promise</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mb-6" />
            <p className="max-w-2xl mx-auto text-zinc-400">Experience true luxury with furniture that is meticulously crafted to elevate your living spaces.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-amber-500 mb-6 border border-zinc-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Handcrafted Quality</h3>
              <p className="text-sm leading-relaxed">Built with premium Teak wood and luxury fabrics. Every piece is crafted by master artisans to ensure lasting durability and timeless beauty.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-amber-500 mb-6 border border-zinc-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M2 12V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6"/><path d="M2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6"/><path d="M12 2v20"/><path d="m8 16 4 4 4-4"/><path d="m8 8 4-4 4 4"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">100% Customisable</h3>
              <p className="text-sm leading-relaxed">Your home, your rules. From dimensions and colors to fabrics and finishes, we tailor every detail to fit your unique space perfectly.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-amber-500 mb-6 border border-zinc-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Design Consultation</h3>
              <p className="text-sm leading-relaxed">Not sure what fits best? Chat directly with our interior design experts for personalized recommendations and styling advice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AR Furniture</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Premium Quality', desc: 'Crafted with high-grade materials for durability and comfort.' },
              { title: 'Customisation Available', desc: 'Get furniture made exactly to your space and style requirements.' },
              { title: 'Direct Furniture Source', desc: 'Eliminating middlemen to bring you the best value.' },
              { title: 'Modern Designs', desc: 'Contemporary aesthetics that elevate your living spaces.' },
              { title: 'Trusted Service', desc: 'Reliable delivery and after-sales support in Vadodara.' }
            ].map((feature, i) => (
              <div key={i} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                <CheckCircle2 className="h-10 w-10 text-amber-500 mb-6" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location CTA */}
      <section className="py-24 bg-amber-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">Looking for Custom Furniture?</h2>
            <p className="text-lg text-zinc-700 mb-8 max-w-lg leading-relaxed">
              Visit our showroom in Vadodara or chat with our design experts to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="https://wa.me/918511939151" className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold tracking-wide transition-colors shadow-md">
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat on WhatsApp
              </a>
            </div>
            
            <div className="mt-12 flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-zinc-900">Visit Our Showroom</h4>
                <p className="text-zinc-600 mt-1">1-2 Shashtri Nagar, Nr. Purnima Nagar, New VIP Road, Vadodara, Gujarat</p>
              </div>
            </div>
          </div>
          <div className="md:w-5/12 w-full h-[400px] bg-zinc-200 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            {/* Google Maps Embed placeholder */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14766.155700813733!2d73.2081283!3d22.3168285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8aa3bc84569%3A0xc68297b5e40702c2!2sVadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  )
}
