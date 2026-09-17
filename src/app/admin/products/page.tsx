import { createClient } from '@/lib/supabase/server'
import { ProductForm } from './ProductForm'
import { deleteProduct } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Edit } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProductsPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name), product_images(image_url)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Products</h1>
        <p className="text-zinc-500">Manage your furniture catalog.</p>
      </div>

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
                        <img 
                          src={prod.product_images[0].image_url} 
                          alt={prod.name}
                          className="object-cover w-full h-full"
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
