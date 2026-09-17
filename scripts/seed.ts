import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // or service role key

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in env")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const dummyCategories = [
  { name: 'Sofa', slug: 'sofa', description: 'Premium sofas for your living room' },
  { name: 'Sofa Cum Bed', slug: 'sofa-cum-bed', description: 'Space saving sofa cum beds' },
  { name: 'Bed', slug: 'bed', description: 'Comfortable beds for a good night sleep' },
  { name: 'Dining', slug: 'dining', description: 'Elegant dining tables and chairs' },
  { name: 'Chair', slug: 'chair', description: 'Comfortable chairs for every room' },
  { name: 'TV Unit', slug: 'tv-unit', description: 'Modern TV units for your entertainment center' },
  { name: 'Wardrobe', slug: 'wardrobe', description: 'Spacious wardrobes for your clothing' },
  { name: 'Office Furniture', slug: 'office-furniture', description: 'Ergonomic office furniture' }
]

const dummyProducts = [
  { name: 'Modern Velvet Sofa', catSlug: 'sofa', desc: 'A luxurious velvet sofa that brings elegance to any living room.', price: 45000, featured: true },
  { name: 'Classic Leather Sofa', catSlug: 'sofa', desc: 'Timeless leather sofa with premium stitching.', price: 65000, featured: false },
  { name: 'Compact Fabric Sofa', catSlug: 'sofa', desc: 'Perfect for small apartments.', price: null, featured: false },
  { name: 'Convertible Sofa Cum Bed', catSlug: 'sofa-cum-bed', desc: 'Easily converts from a comfortable sofa to a full bed.', price: 32000, featured: true },
  { name: 'Premium Sofa Bed', catSlug: 'sofa-cum-bed', desc: 'High density foam sofa bed.', price: 38000, featured: false },
  { name: 'King Size Wooden Bed', catSlug: 'bed', desc: 'Solid teak wood king size bed with storage.', price: 55000, featured: true },
  { name: 'Queen Size Upholstered Bed', catSlug: 'bed', desc: 'Soft upholstered headboard with modern design.', price: 42000, featured: false },
  { name: 'Minimalist Platform Bed', catSlug: 'bed', desc: 'Sleek design for modern bedrooms.', price: null, featured: false },
  { name: '6-Seater Marble Dining Table', catSlug: 'dining', desc: 'Elegant dining table with faux marble top and 6 chairs.', price: 75000, featured: true },
  { name: '4-Seater Wooden Dining Set', catSlug: 'dining', desc: 'Compact wooden dining set for small families.', price: 28000, featured: false },
  { name: 'Ergonomic Office Chair', catSlug: 'chair', desc: 'Comfortable chair with lumbar support for long working hours.', price: 8500, featured: true },
  { name: 'Accent Lounge Chair', catSlug: 'chair', desc: 'Stylish lounge chair to accent your living space.', price: 12000, featured: false },
  { name: 'Floating TV Unit', catSlug: 'tv-unit', desc: 'Wall-mounted TV unit with hidden storage.', price: 18000, featured: true },
  { name: 'Standing Entertainment Center', catSlug: 'tv-unit', desc: 'Large TV unit with ample display shelves.', price: null, featured: false },
  { name: '3-Door Wardrobe', catSlug: 'wardrobe', desc: 'Spacious wardrobe with mirror.', price: 25000, featured: true },
  { name: 'Sliding Door Wardrobe', catSlug: 'wardrobe', desc: 'Modern sliding door wardrobe to save space.', price: 35000, featured: false },
  { name: 'Executive Office Desk', catSlug: 'office-furniture', desc: 'Large wooden desk with drawers.', price: 22000, featured: true },
  { name: 'Standing Desk', catSlug: 'office-furniture', desc: 'Height adjustable standing desk.', price: 30000, featured: false },
  { name: 'L-Shaped Corner Sofa', catSlug: 'sofa', desc: 'Large comfortable corner sofa for the whole family.', price: 85000, featured: true },
  { name: 'Kids Bunk Bed', catSlug: 'bed', desc: 'Fun and safe bunk bed with ladder.', price: null, featured: false },
]

async function seed() {
  console.log("Seeding database...")

  for (const cat of dummyCategories) {
    const { error } = await supabase.from('categories').upsert([cat], { onConflict: 'slug' })
    if (error) console.error("Error inserting category:", error.message)
  }

  const { data: categories } = await supabase.from('categories').select('id, slug')
  const categoryMap = new Map(categories?.map(c => [c.slug, c.id]))

  for (const prod of dummyProducts) {
    const category_id = categoryMap.get(prod.catSlug)
    if (!category_id) continue

    const slug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const { error } = await supabase.from('products').upsert([{
      name: prod.name,
      slug: slug,
      category_id: category_id,
      description: prod.desc,
      price: prod.price,
      is_featured: prod.featured,
      is_active: true
    }], { onConflict: 'slug' })

    if (error) console.error("Error inserting product:", error.message)
  }

  console.log("Seeding complete.")
}

seed()
