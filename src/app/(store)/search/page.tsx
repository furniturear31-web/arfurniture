import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'

export const metadata = {
  title: 'Search | AR FURNITURE',
  description: 'Search for premium furniture.',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q : ''

  let products: any[] | null = null

  if (q) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*, product_images(image_url, is_main)')
      .eq('is_active', true)
      .ilike('name', `%${q}%`)
      .order('created_at', { ascending: false })
      
    products = data
  }

  return (
    <div className="bg-zinc-50 py-12 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 text-center mb-8">
            Search Furniture
          </h1>
          <form action="/search" method="GET" className="relative flex items-center">
            <input 
              type="text" 
              name="q" 
              defaultValue={q}
              placeholder="Search for sofas, beds, tables..." 
              className="w-full pl-12 pr-4 py-4 rounded-full border border-zinc-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none shadow-sm text-lg"
              autoFocus
            />
            <Search className="absolute left-4 h-6 w-6 text-zinc-400" />
            <button type="submit" className="absolute right-2 bg-zinc-900 hover:bg-amber-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
              Search
            </button>
          </form>
        </div>

        {q && (
          <div className="mb-8">
            <p className="text-zinc-600 text-lg">
              Showing results for <span className="font-semibold text-zinc-900">"{q}"</span>
              {products && ` (${products.length} found)`}
            </p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => {
              const mainImage = product.product_images?.find((img: any) => img.is_main) || product.product_images?.[0]
              const hoverImage = product.product_images?.find((img: any) => !img.is_main) || mainImage

              return (
                <div key={product.id} className="group relative bg-white rounded-lg shadow-sm overflow-hidden border border-zinc-100 hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] sm:aspect-square relative overflow-hidden bg-zinc-100">
                    <Link href={`/product/${product.slug}`}>
                      {mainImage ? (
                        <>
                          <Image 
                            src={mainImage.image_url} 
                            alt={product.name} 
                            fill
                            className="object-cover object-center group-hover:opacity-0 transition-opacity duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                          {hoverImage && hoverImage !== mainImage && (
                            <Image 
                              src={hoverImage.image_url} 
                              alt={`${product.name} alternate view`} 
                              fill
                              className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          No Image
                        </div>
                      )}
                    </Link>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-zinc-900 line-clamp-1 mb-1">
                      <Link href={`/product/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-sm font-semibold text-amber-600">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {products && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500 text-lg">No products found matching your search.</p>
            <Link href="/shop" className="inline-block mt-4 text-amber-600 hover:text-amber-700 font-medium">
              Browse all products &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
