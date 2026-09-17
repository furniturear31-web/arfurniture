import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EditProductForm } from './EditProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: categories } = await supabase.from('categories').select('*').order('name')
  
  const { data: product } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('id', id)
    .single()

  if (!product) {
    redirect('/admin/products')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Edit Product</h1>
        <p className="text-zinc-500">Update details for {product.name}</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <EditProductForm product={product} categories={categories || []} />
      </div>
    </div>
  )
}
