import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, Grid, ShoppingCart, LogOut, MessageSquare } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 text-zinc-300 flex-shrink-0 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 bg-zinc-900 border-b border-zinc-800">
          <span className="text-lg font-bold text-white tracking-wider">AR FURNITURE</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link href="/admin" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
            <Package className="mr-3 h-5 w-5" />
            Products
          </Link>
          <Link href="/admin/categories" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
            <Grid className="mr-3 h-5 w-5" />
            Categories
          </Link>
          <Link href="/admin/orders" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
            <ShoppingCart className="mr-3 h-5 w-5" />
            Orders
          </Link>
          <Link href="/admin/settings" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <form action={async () => {
            'use server'
            const sb = await createClient()
            await sb.auth.signOut()
            redirect('/login')
          }}>
            <button className="flex w-full items-center px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 md:hidden">
            <span className="text-lg font-bold text-zinc-900 tracking-wider">AR FURNITURE ADMIN</span>
            {/* Mobile menu toggle would go here */}
        </header>
        <div className="flex-1 overflow-auto bg-zinc-50 p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
