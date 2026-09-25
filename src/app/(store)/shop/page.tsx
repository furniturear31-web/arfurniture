export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Filter } from 'lucide-react'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Shop Premium Furniture | AR FURNITURE',
  description: 'Browse our complete collection of premium furniture in Vadodara.',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()

  const params = await searchParams
  const categorySlug = typeof params.category === 'string' ? params.category : 'sofa'
  
  if (!params.category) {
    redirect('/shop?category=sofa')
  }
  
  // Fetch categories for filter
  const { data: rawCategories } = await supabase.from('categories').select('*').eq('is_active', true)
  
  // Sort categories to always show 'sofa' first
  const categories = rawCategories?.sort((a, b) => {
    if (a.slug === 'sofa') return -1
    if (b.slug === 'sofa') return 1
    return a.name.localeCompare(b.name)
  }) || []
  
  let query = supabase
    .from('products')
    .select('*, categories!inner(name, slug), product_images(image_url, is_main)')
    .eq('is_active', true)
    
  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug)
  }
  
  const { data: products, error: productsError } = await query.order('created_at', { ascending: false })

  if (productsError) {
    console.error("SUPABASE ERROR FETCHING PRODUCTS:", productsError)
  }

  const activeCategoryName = categories.find(c => c.slug === categorySlug)?.name || 'Products'

  return (
    <div className="bg-zinc-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {activeCategoryName}
          </h1>
          <p className="mt-2 text-sm text-zinc-500 md:mt-0">
            Showing {products?.length || 0} result(s)
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Filters - Sticky and Premium */}
          <aside className="lg:w-64 flex-shrink-0 sticky top-28">
             <div className="bg-zinc-900 p-6 rounded-2xl shadow-2xl border border-zinc-800">
                <div className="flex items-center mb-6 border-b border-zinc-800 pb-4">
                  <Filter className="h-5 w-5 text-amber-500 mr-2" />
                  <h3 className="font-semibold text-white tracking-wide uppercase text-sm">Collections</h3>
                </div>
                <ul className="space-y-2">
                  {categories.map(c => {
                    const isActive = categorySlug === c.slug
                    return (
                      <li key={c.id}>
                        <Link 
                          href={`/shop?category=${c.slug}`} 
                          className={`block px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                            isActive 
                              ? 'bg-zinc-800 text-amber-500 shadow-md border-l-4 border-amber-500' 
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                          }`}
                        >
                          {c.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
             </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map(product => {
                  const mainImage = product.product_images?.find((img:any) => img.is_main) || product.product_images?.[0]
                  const hoverImage = product.product_images?.find((img: any) => !img.is_main) || product.product_images?.[1]
                  return (
                    <div key={product.id} className="group flex flex-col bg-white rounded-xl overflow-hidden border border-zinc-100 shadow-xs hover:shadow-lg transition-shadow">
                      <Link href={`/product/${product.slug}`} className="aspect-[4/3] sm:aspect-square relative overflow-hidden bg-zinc-100">
                        {mainImage ? (
                          <>
                            <Image 
                              src={mainImage.image_url} 
                              alt={product.name} 
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className={`object-cover transition-all duration-500 ${hoverImage && hoverImage !== mainImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                              loading="lazy"
                            />
                            {hoverImage && hoverImage !== mainImage && (
                              <Image 
                                src={hoverImage.image_url} 
                                alt={`${product.name} alternate view`} 
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105" 
                                loading="lazy"
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
            ) : (
              <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
                <h3 className="text-lg font-medium text-zinc-900 mb-2">No products found</h3>
                <p className="text-zinc-500">We couldn't find any products matching your criteria.</p>
                <Link href="/shop?category=sofa" className="mt-6 inline-block px-6 py-3 bg-zinc-900 text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors">
                  View Sofas
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
