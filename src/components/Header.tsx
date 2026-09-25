'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, X, MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Header({ categories }: { categories: any[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Sort categories so sofa is first
  const sortedCategories = categories?.sort((a, b) => {
    if (a.slug === 'sofa') return -1
    if (b.slug === 'sofa') return 1
    return a.name.localeCompare(b.name)
  }) || []

  return (
    <header className="sticky top-0 z-50 bg-zinc-950 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo.webp" alt="AR FURNITURE Logo" width={48} height={48} className="mr-3" />
              <span className="text-2xl font-bold tracking-widest text-amber-500">AR FURNITURE</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'bg-zinc-800 text-white shadow-inner' 
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/shop' || pathname.startsWith('/product/')
                  ? 'bg-zinc-800 text-white shadow-inner' 
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Shop
            </Link>
            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center">
                Categories
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white text-zinc-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden border border-zinc-200">
                <div className="py-2">
                  {sortedCategories?.map(c => (
                    <Link key={c.id} href={`/shop?category=${c.slug}`} className="block px-4 py-2 text-sm hover:bg-zinc-100 font-medium text-zinc-700 hover:text-zinc-950">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link 
              href="/about" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/about' 
                  ? 'bg-zinc-800 text-white shadow-inner' 
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/contact' 
                  ? 'bg-zinc-800 text-white shadow-inner' 
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/search" className={`p-2 rounded-full transition-colors ${pathname === '/search' ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}`}>
              <Search className="h-5 w-5" />
            </Link>
            <a href="https://wa.me/918511939151?text=Hello%20AR%20Furniture,%20I%20would%20like%20to%20know%20more%20about%20your%20furniture%20collection." target="_blank" rel="noopener noreferrer" className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp Us
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/search" className={`p-2 rounded-full ${pathname === '/search' ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:text-white'}`}>
              <Search className="h-5 w-5" />
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-zinc-300 hover:text-white focus:outline-none p-2 rounded-md hover:bg-zinc-800"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 absolute w-full shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === '/' ? 'bg-zinc-800 text-white border-l-4 border-amber-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === '/shop' ? 'bg-zinc-800 text-white border-l-4 border-amber-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Shop
            </Link>
            
            <div className="px-3 py-2 text-base font-medium text-zinc-400">Categories</div>
            <div className="pl-6 space-y-1">
              {sortedCategories?.map(c => (
                <Link 
                  key={c.id} 
                  href={`/shop?category=${c.slug}`} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <Link 
              href="/about" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === '/about' ? 'bg-zinc-800 text-white border-l-4 border-amber-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === '/contact' ? 'bg-zinc-800 text-white border-l-4 border-amber-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
