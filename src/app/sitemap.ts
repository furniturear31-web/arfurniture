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
    url: `https://www.arfurniture.co.in/product/${product.slug}`,
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
    url: `https://www.arfurniture.co.in/shop?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  return [
    {
      url: 'https://www.arfurniture.co.in',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://www.arfurniture.co.in/shop',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://www.arfurniture.co.in/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://www.arfurniture.co.in/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://www.arfurniture.co.in/faq',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...productUrls,
    ...categoryUrls,
  ]
}
