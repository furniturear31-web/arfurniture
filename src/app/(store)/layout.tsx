import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').eq('is_active', true)
  const { data: settings } = await supabase.from('store_settings').select('*').eq('id', true).maybeSingle()

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans overflow-x-hidden">
      {settings?.is_announcement_active && (
        <div className="bg-amber-600 text-white py-2 px-4 text-sm font-medium tracking-wide marquee-container">
          <div className="animate-marquee">
            {settings.announcement_text}
          </div>
        </div>
      )}
      <Header categories={categories || []} />

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-bold tracking-widest text-amber-500 mb-4 block">AR FURNITURE</span>
            <p className="text-sm leading-relaxed mb-4">
              Premium Furniture for Modern Living. Discover stylish, comfortable and quality furniture for your home and workspace.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider text-sm uppercase">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-amber-500 transition-colors">Shop</Link></li>
              <li><Link href="/about" className="hover:text-amber-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-amber-500 transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-amber-500 transition-colors">FAQs</Link></li>
              <li className="pt-2"><Link href="/terms" className="hover:text-amber-500 transition-colors text-zinc-500">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-amber-500 transition-colors text-zinc-500">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-amber-500 transition-colors text-zinc-500">Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-amber-500 transition-colors text-zinc-500">Shipping Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider text-sm uppercase">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories?.slice(0, 5).map(c => (
                <li key={c.id}><Link href={`/shop?category=${c.slug}`} className="hover:text-amber-500 transition-colors">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider text-sm uppercase">Contact Us</h3>
            <address className="not-italic text-sm space-y-2">
              <p>1-2 Shashtri Nagar, Nr. Purnima Nagar,</p>
              <p>New VIP Road, Vadodara, Gujarat</p>
              <p className="pt-2">Phone: <a href="tel:8511939151" className="hover:text-amber-500">8511939151</a></p>
              <p>Alt Phone: <a href="tel:9898375739" className="hover:text-amber-500">9898375739</a></p>
            </address>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-zinc-900 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} AR FURNITURE. All rights reserved.</p>
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
