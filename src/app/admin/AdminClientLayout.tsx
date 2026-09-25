'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  Grid, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bill-book', label: 'Bill Book / POS', icon: FileText },
  { href: '/admin/clients', label: 'Clients / Khata', icon: Users },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Grid },
  { href: '/admin/orders', label: 'Web Orders', icon: ShoppingCart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminClientLayout({
  children,
  signOutAction
}: {
  children: React.ReactNode
  signOutAction: () => Promise<void>
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-zinc-950 text-zinc-300 z-50 transform transition-transform duration-300 flex flex-col md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 bg-zinc-900 border-b border-zinc-800 shrink-0">
          <Link href="/admin" className="text-lg font-bold text-white tracking-wider">
            AR FURNITURE
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3.5 py-3 text-sm font-semibold rounded-xl transition-all ${
                  active
                    ? 'bg-zinc-800 text-white shadow-inner border-l-4 border-amber-500'
                    : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800 shrink-0">
          <form action={signOutAction}>
            <button className="flex w-full items-center px-3.5 py-2.5 text-sm font-semibold text-zinc-400 hover:text-red-400 hover:bg-zinc-900 rounded-xl transition-colors">
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-2 text-zinc-600 hover:text-black rounded-lg hover:bg-zinc-100"
            >
              <Menu size={22} />
            </button>
            <span className="text-sm font-bold text-zinc-900 md:hidden">AR FURNITURE</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-[#c8941a] px-3 py-2 rounded-lg bg-zinc-100 border border-zinc-200 transition-colors"
            >
              <span>Live Website</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-zinc-50 min-w-0 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
