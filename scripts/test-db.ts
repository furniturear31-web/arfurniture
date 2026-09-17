import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in env")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function test() {
  const { data: categories, error: catError } = await supabase.from('categories').select('*')
  console.log("Categories:", categories?.length, catError)

  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*, categories!inner(name, slug), product_images(image_url, is_main)')
    .eq('is_active', true)
    
  console.log("Products:", products?.length, prodError)
}

test()
