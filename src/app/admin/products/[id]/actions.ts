'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProduct(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  // If we change the name, we shouldn't necessarily change the slug as it breaks SEO, but for now we keep the old slug
  // or we could update it. Let's keep it simple and just update the details.
  const category_id = formData.get('category_id') as string
  const description = formData.get('description') as string
  const priceInput = formData.get('price') as string
  const price = priceInput ? parseFloat(priceInput) : null
  const is_active = formData.get('is_active') === 'on'
  const is_featured = formData.get('is_featured') === 'on'
  
  const { error } = await supabase
    .from('products')
    .update({
      name, category_id, description, price, is_active, is_featured
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating product:', error)
    return { error: error.message || 'Error updating product' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  return { success: true }
}
