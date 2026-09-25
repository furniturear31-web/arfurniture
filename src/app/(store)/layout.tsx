import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { createPublicClient } from '@/lib/supabase/public'
import Header from '@/components/Header'

export const revalidate = 3600 // 1 hour caching

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createPublicClient()
  const { data: categories } = await supabase.from('categories').select('*').eq('is_active', true)
  const { data: settings } = await supabase.from('store_settings').select('*').eq('id', true).maybeSingle()

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans">
      <Header categories={categories || []} />

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-4 lg:col-span-4">
            <span className="text-2xl font-bold tracking-widest text-amber-500 mb-6 block">AR FURNITURE</span>
            <p className="text-sm leading-relaxed mb-8 text-zinc-500 pr-4">
              Crafting premium furniture for modern living. Discover stylish, comfortable, and luxury pieces tailored for your home and workspace.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-amber-600 hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-amber-600 hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-amber-600 hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-2 lg:col-start-6">
            <h3 className="text-white font-semibold mb-6 tracking-wider text-sm uppercase">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-amber-500 transition-colors flex items-center"><span className="mr-2 text-zinc-700">-</span> Home</Link></li>
              <li><Link href="/shop" className="hover:text-amber-500 transition-colors flex items-center"><span className="mr-2 text-zinc-700">-</span> Shop All</Link></li>
              <li><Link href="/about" className="hover:text-amber-500 transition-colors flex items-center"><span className="mr-2 text-zinc-700">-</span> Our Story</Link></li>
              <li><Link href="/faq" className="hover:text-amber-500 transition-colors flex items-center"><span className="mr-2 text-zinc-700">-</span> FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-amber-500 transition-colors flex items-center"><span className="mr-2 text-zinc-700">-</span> Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-white font-semibold mb-6 tracking-wider text-sm uppercase">Collections</h3>
            <ul className="space-y-3 text-sm">
              {categories?.slice(0, 5).map(c => (
                <li key={c.id}><Link href={`/shop?category=${c.slug}`} className="hover:text-amber-500 transition-colors flex items-center"><span className="mr-2 text-zinc-700">-</span> {c.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 lg:col-span-3">
            <h3 className="text-white font-semibold mb-6 tracking-wider text-sm uppercase">Get in Touch</h3>
            <address className="not-italic text-sm space-y-4 text-zinc-500">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p>1-2 Shashtri Nagar, Nr. Purnima Nagar, New VIP Road, Vadodara, Gujarat</p>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <p><a href="tel:8511939151" className="hover:text-amber-500 transition-colors">8511939151</a> / <a href="tel:9898375739" className="hover:text-amber-500 transition-colors">9898375739</a></p>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <p><a href="mailto:furniturear31@gmail.com" className="hover:text-amber-500 transition-colors">furniturear31@gmail.com</a></p>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-600">
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} AR FURNITURE. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-amber-500 transition-colors">Terms & Conditions</Link>
            <Link href="/privacy-policy" className="hover:text-amber-500 transition-colors">Privacy Policy</Link>
            <Link href="/refund-policy" className="hover:text-amber-500 transition-colors">Refund Policy</Link>
            <Link href="/shipping-policy" className="hover:text-amber-500 transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button (Design Expert) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end group">
        <div className="mb-2 px-3 py-1 bg-white text-zinc-900 text-xs font-semibold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-100 hidden md:block">
          Chat with a Design Expert
        </div>
        <a 
          href="https://wa.me/918511939151?text=Hello%20AR%20Furniture,%20I%20would%20like%20to%20consult%20with%20a%20design%20expert." 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-center bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
        >
          <div className="flex items-center px-4 py-3 md:py-3 md:pr-5">
            <MessageCircle className="h-6 w-6" />
            <span className="hidden md:block ml-2 font-medium">Design Expert</span>
          </div>
        </a>
      </div>
    </div>
  )
}
