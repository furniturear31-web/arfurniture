import { createClient } from '@/lib/supabase/server'
import { ProductForm } from './ProductForm'
import { deleteProduct } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Edit, ImageIcon, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const OVERALL_IMAGE_LIMIT = 300

export default async function ProductsPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  
  const [
    { data: products },
    { count: totalImagesCount }
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*, categories(name), product_images(image_url)')
      .order('created_at', { ascending: false }),
    supabase
      .from('product_images')
      .select('*', { count: 'exact', head: true })
  ])

  const imageCount = totalImagesCount || 0
  const usagePercentage = Math.min(100, Math.round((imageCount / OVERALL_IMAGE_LIMIT) * 100))

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Products Catalog</h1>
          <p className="text-zinc-500">Manage your furniture catalog and product images.</p>
        </div>

        {/* Overall Image Quota Counter Badge */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs flex items-center gap-4 min-w-[260px]">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#c8941a] flex items-center justify-center font-bold">
            <ImageIcon size={22} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-zinc-700">Image Quota</span>
              <span className={imageCount >= OVERALL_IMAGE_LIMIT ? 'text-red-600 font-extrabold' : 'text-[#c8941a]'}>
                {imageCount} / {OVERALL_IMAGE_LIMIT}
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  imageCount >= OVERALL_IMAGE_LIMIT ? 'bg-red-600' :
                  usagePercentage > 80 ? 'bg-orange-500' : 'bg-[#c8941a]'
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">Overall site limit max 300 images</p>
          </div>
        </div>
      </div>

      {imageCount >= OVERALL_IMAGE_LIMIT && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3 shadow-xs">
          <AlertCircle size={24} className="shrink-0" />
          <div className="text-xs font-semibold">
            <p className="font-bold">Overall 300 Image Limit Reached!</p>
            <p>You cannot upload new product images. Please delete unused products or images to free up quota.</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm categories={categories || []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell>
                    {prod.product_images?.[0]?.image_url ? (
                      <div className="relative h-12 w-12 rounded overflow-hidden">
                        <Image 
                          src={prod.product_images[0].image_url} 
                          alt={prod.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 bg-zinc-100 rounded flex items-center justify-center text-xs text-zinc-400">No Img</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{prod.name}</TableCell>
                  <TableCell>{prod.categories?.name}</TableCell>
                  <TableCell>{prod.price ? `₹${prod.price}` : 'On Request'}</TableCell>
                  <TableCell>{prod.is_active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${prod.id}`}>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form action={async () => {
                        'use server'
                        await deleteProduct(prod.id)
                      }}>
                        <Button variant="destructive" size="icon" type="submit">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!products || products.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-zinc-500">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
