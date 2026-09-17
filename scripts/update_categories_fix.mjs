import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function run() {
  const updates = [
    { slug: 'chair', url: '/categories/chairs.webp' },
    { slug: 'sofa-cum-bed', url: '/categories/sofa-cum-bed.webp' },
    { slug: 'dining', url: '/categories/dining-tables.webp' },
    { slug: 'sofa', url: '/categories/sofas.webp' },
    { slug: 'bed', url: '/categories/beds.webp' },
  ]

  for (const item of updates) {
    console.log(`Updating DB for ${item.slug} with ${item.url}`)
    await supabase
      .from('categories')
      .update({ image_url: item.url })
      .eq('slug', item.slug)
  }
  
  console.log('Done!')
}

run().catch(console.error)
