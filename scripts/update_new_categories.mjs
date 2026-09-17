import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const images = [
  { file: 'C:/Users/jafar khan/.gemini/antigravity/brain/58f6389f-c3b5-45f3-a7a6-7e01303bf219/.user_uploaded/media_1789625249170.jpg', slug: 'wardrobe' },
  { file: 'C:/Users/jafar khan/.gemini/antigravity/brain/58f6389f-c3b5-45f3-a7a6-7e01303bf219/.user_uploaded/media_1789625249191.jpg', slug: 'tv-unit' },
  { file: 'C:/Users/jafar khan/.gemini/antigravity/brain/58f6389f-c3b5-45f3-a7a6-7e01303bf219/.user_uploaded/media_1789625249210.jpg', slug: 'office-furniture' }
]

async function run() {
  const publicDir = path.join(process.cwd(), 'public', 'categories')

  for (const item of images) {
    const webpFilename = `${item.slug}.webp`
    const destPath = path.join(publicDir, webpFilename)
    
    console.log(`Converting ${item.file} to ${webpFilename}...`)
    await sharp(item.file)
      .webp({ quality: 80 })
      .toFile(destPath)
  }
  console.log('Done converting images!')
}

run().catch(console.error)
