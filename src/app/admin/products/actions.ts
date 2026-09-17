'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import sharp from 'sharp'

export async function addProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  const slug = `${baseSlug}-${randomSuffix}`
  const category_id = formData.get('category_id') as string
  const description = formData.get('description') as string
  const priceInput = formData.get('price') as string
  const price = priceInput ? parseFloat(priceInput) : null
  const sku = formData.get('sku') as string
  const is_active = formData.get('is_active') === 'on'
  const is_featured = formData.get('is_featured') === 'on'
  
  const images = formData.getAll('images') as File[]

  // Insert product first
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert([{
      name, slug, category_id, description, price, is_active, is_featured
    }])
    .select()
    .single()

  if (productError || !product) {
    console.error('Error adding product:', productError)
    return { error: productError?.message || 'Error adding product' }
  }

  // Process and upload images
  for (let i = 0; i < images.length; i++) {
    const file = images[i]
    if (file.size === 0) continue

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Process image with Sharp
    // 1:1 aspect ratio, fit inside, padding with transparent/white, or cover
    // The requirement says "do not stretch or distort".
    // We'll use 'contain' with a specific background, or 'cover'. Let's use cover (crop) to ensure it fills the 1:1 square.
    // Wait, "Keep the important furniture area visible" - cover might cut edges. "crop/fit it into a 1:1 square" 
    // We can use 'contain' with a white/transparent background, or just 'cover'. Cover is standard for e-commerce. Let's use 'cover'.
    const processedBuffer = await sharp(buffer)
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .webp({ quality: 80 })
      .toBuffer()

    const filename = `${product.id}-${Date.now()}-${i}.webp`
    
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filename, processedBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      })

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filename)
      
      await supabase.from('product_images').insert([{
        product_id: product.id,
        image_url: publicUrl,
        is_main: i === 0
      }])
    } else {
        console.error('Upload error:', uploadError)
        return { error: 'Image Upload Error: ' + uploadError.message }
    }
  }

  revalidatePath('/admin/products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  return { success: true }
}
