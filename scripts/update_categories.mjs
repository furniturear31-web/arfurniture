import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const images = [
  { file: 'C:/Users/jafar khan/.gemini/antigravity/brain/58f6389f-c3b5-45f3-a7a6-7e01303bf219/.user_uploaded/media_1789623698028.jpg', slug: 'chairs' },
  { file: 'C:/Users/jafar khan/.gemini/antigravity/brain/58f6389f-c3b5-45f3-a7a6-7e01303bf219/.user_uploaded/media_1789623698048.jpg', slug: 'sofa-cum-bed' },
  { file: 'C:/Users/jafar khan/.gemini/antigravity/brain/58f6389f-c3b5-45f3-a7a6-7e01303bf219/.user_uploaded/media_1789623698062.jpg', slug: 'dining-tables' },
  { file: 'C:/Users/jafar khan/.gemini/antigravity/brain/58f6389f-c3b5-45f3-a7a6-7e01303bf219/.user_uploaded/media_1789623698079.jpg', slug: 'sofas' },
  { file: 'C:/Users/jafar khan/.gemini/antigravity/brain/58f6389f-c3b5-45f3-a7a6-7e01303bf219/.user_uploaded/media_1789623714644.jpg', slug: 'beds' }
]

async function run() {
  const publicDir = path.join(process.cwd(), 'public', 'categories')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  // 1. Fetch categories to see what slugs we actually have
  const { data: categories } = await supabase.from('categories').select('*')
  console.log('Categories in DB:', categories.map(c => c.slug))

  for (const item of images) {
    const webpFilename = `${item.slug}.webp`
    const destPath = path.join(publicDir, webpFilename)
    
    // Convert to webp
    console.log(`Converting ${item.file} to ${webpFilename}...`)
    await sharp(item.file)
      .webp({ quality: 80 })
      .toFile(destPath)
      
    // Find matching category (fuzzy match)
    const category = categories.find(c => c.slug.includes(item.slug.replace('s', '')) || item.slug.includes(c.slug.replace('s', '')))
    if (category) {
      console.log(`Updating DB for ${category.slug} with /categories/${webpFilename}`)
      await supabase
        .from('categories')
        .update({ image_url: `/categories/${webpFilename}` })
        .eq('id', category.id)
    } else {
      console.log(`Could not find category for ${item.slug}`)
    }
  }
  
  console.log('Done!')
}

run().catch(console.error)
