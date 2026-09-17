import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  // Fetch active products
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)

  const productUrls = products?.map((product) => ({
    url: `https://arfurniture-one.vercel.app/product/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  // Fetch active categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
    .eq('is_active', true)

  const categoryUrls = categories?.map((category) => ({
    url: `https://arfurniture-one.vercel.app/shop?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  return [
    {
      url: 'https://arfurniture-one.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://arfurniture-one.vercel.app/shop',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://arfurniture-one.vercel.app/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://arfurniture-one.vercel.app/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://arfurniture-one.vercel.app/faq',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...productUrls,
    ...categoryUrls,
  ]
}
