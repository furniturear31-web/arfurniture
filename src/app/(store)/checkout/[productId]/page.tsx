import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { CheckoutForm } from './CheckoutForm'
import Image from 'next/image'

export default async function CheckoutPage({ params }: { params: Promise<{ productId: string }> }) {
  const supabase = await createClient()
  const { productId } = await params

  const { data: product } = await supabase
    .from('products')
    .select('*, product_images(image_url, is_main)')
    .eq('id', productId)
    .single()

  if (!product || !product.is_active || product.price === null) {
    if (product) {
      redirect(`/product/${product.slug}`)
    }
    notFound()
  }

  const mainImage = product.product_images?.find((img:any) => img.is_main) || product.product_images?.[0]

  return (
    <div className="bg-zinc-50 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-8 text-center">Checkout</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="p-6 sm:p-8 bg-zinc-900 text-white flex items-center space-x-6">
            {mainImage ? (
              <div className="h-24 w-24 rounded-md overflow-hidden bg-white flex-shrink-0">
                <img src={mainImage.image_url} alt={product.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-24 w-24 rounded-md bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 flex-shrink-0">
                No Image
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-amber-500 font-medium text-lg mt-1">₹{product.price.toLocaleString('en-IN')}</p>
              <p className="text-zinc-400 text-sm mt-1">
                + Delivery Charges Extra <br className="sm:hidden" />
                <span className="opacity-75">(To be paid at delivery)</span>
              </p>
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-zinc-900 mb-6">Delivery Details</h3>
            <CheckoutForm product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
