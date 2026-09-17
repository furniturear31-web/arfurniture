import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ImageGallery from './ImageGallery'
import { MessageCircle, ShoppingBag, ShieldCheck, Check } from 'lucide-react'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params
  const { data: product } = await supabase.from('products').select('*').eq('slug', slug).single()
  
  if (!product) return { title: 'Product Not Found' }
  
  return {
    title: `${product.seo_title || product.name} | AR FURNITURE`,
    description: product.seo_description || product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name, slug), product_images(image_url, is_main)')
    .eq('slug', slug)
    .single()

  if (!product || !product.is_active) {
    notFound()
  }

  // Fetch suggested products from the same category
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*, product_images(image_url, is_main)')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .eq('is_active', true)
    .limit(4)

  const images = product.product_images?.sort((a:any, b:any) => a.is_main ? -1 : 1).map((img:any) => img.image_url) || []
  const hasPrice = product.price !== null

  const whatsappMessage = encodeURIComponent(`Hello AR Furniture, I am interested in ${product.name}. Please share the price and details.`)
  const whatsappLink = `https://wa.me/918511939151?text=${whatsappMessage}`

  return (
    <div className="bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button & Breadcrumb */}
        <div className="flex flex-col mb-8 gap-4">
          <Link href="/shop" className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-amber-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
            Back to Shop
          </Link>
          
          <nav className="flex text-sm text-zinc-500 overflow-hidden" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-y-2 space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-zinc-900">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <Link href="/shop" className="hover:text-zinc-900">Shop</Link>
              </div>
            </li>
            {product.categories && (
              <li>
                <div className="flex items-center">
                  <span className="mx-2">/</span>
                  <Link href={`/shop?category=${product.categories.slug}`} className="hover:text-zinc-900">{product.categories.name}</Link>
                </div>
              </li>
            )}
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-zinc-900 font-medium truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          
          {/* Image Gallery */}
          <div className="lg:max-w-lg lg:self-start">
            <ImageGallery images={images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 lg:mt-0">
            <div className="mb-6">
              {product.categories && (
                <Link href={`/shop?category=${product.categories.slug}`} className="text-amber-600 font-semibold tracking-wider text-sm uppercase">
                  {product.categories.name}
                </Link>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mt-2 mb-4">{product.name}</h1>
              
              <div className="flex items-center justify-between">
                {hasPrice ? (
                  <p className="text-3xl tracking-tight text-zinc-900 font-bold">₹{product.price.toLocaleString('en-IN')}</p>
                ) : (
                  <p className="text-2xl tracking-tight text-amber-600 font-medium">Price on Request</p>
                )}
                
                <div className="flex items-center text-sm">
                  <span className="flex items-center text-green-600 font-medium"><Check className="h-4 w-4 mr-1"/> In Stock</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {hasPrice ? (
                <>
                  <Link href={`/checkout/${product.id}`} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center py-4 px-8 rounded-md font-bold text-lg transition-colors shadow-lg">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    BUY NOW
                  </Link>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="sm:w-auto bg-green-50 hover:bg-green-100 text-green-700 flex items-center justify-center py-4 px-6 rounded-md font-bold transition-colors border border-green-200">
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </>
              ) : (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center py-4 px-8 rounded-md font-bold text-lg transition-colors shadow-lg">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  ENQUIRE ON WHATSAPP
                </a>
              )}
            </div>

            <div className="mt-8 border-t border-zinc-200 pt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-zinc-700 leading-relaxed space-y-4">
                {product.description?.split('\n').map((line:string, i:number) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
            
            {product.sku && (
              <div className="mt-6 flex items-center text-sm text-zinc-500">
                <span className="font-medium text-zinc-900 mr-2">SKU:</span> {product.sku}
              </div>
            )}
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-200 pt-8">
               <div className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-zinc-900">Premium Quality</h4>
                    <p className="mt-1 text-xs text-zinc-500">Built to last with high-grade materials.</p>
                  </div>
               </div>
               <div className="flex items-start">
                  <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-zinc-900">Customisation Available</h4>
                    <p className="mt-1 text-xs text-zinc-500">Tailored to fit your unique space.</p>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* Suggested Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900 mb-8">You might also like</h2>
            {/* Scrollable container on mobile, grid on desktop */}
            <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 snap-x snap-mandatory hide-scrollbar">
              {relatedProducts.map(related => {
                const mainImage = related.product_images?.find((img: any) => img.is_main) || related.product_images?.[0]
                return (
                  <div key={related.id} className="w-[140px] sm:w-auto sm:min-w-0 flex-shrink-0 snap-start group flex flex-col bg-white rounded-xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                    <Link href={`/product/${related.slug}`} className="aspect-square relative overflow-hidden bg-zinc-100">
                      {mainImage ? (
                        <img 
                          src={mainImage.image_url} 
                          alt={related.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">No Image</div>
                      )}
                    </Link>
                    <div className="p-2 sm:p-4 flex flex-col flex-grow">
                      <Link href={`/product/${related.slug}`}>
                        <h3 className="font-medium text-xs sm:text-base text-zinc-900 line-clamp-2 mb-1 group-hover:text-amber-600 transition-colors">{related.name}</h3>
                      </Link>
                      <div className="flex items-center justify-between mt-auto pt-1 sm:pt-2">
                        {related.price ? (
                          <span className="font-bold text-sm sm:text-base text-zinc-900">₹{related.price.toLocaleString('en-IN')}</span>
                        ) : (
                          <span className="font-medium text-[10px] sm:text-xs text-amber-600">On Request</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
