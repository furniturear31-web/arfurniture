'use client'

import { useState } from 'react'
import { updateProduct } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function EditProductForm({ product, categories }: { product: any, categories: any[] }) {
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    
    const formData = new FormData(event.currentTarget)
    formData.append('id', product.id)
    
    const result = await updateProduct(formData)
    
    setLoading(false)
    if (result.success) {
      window.location.href = '/admin/products'
    } else {
      alert(result.error)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" defaultValue={product.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category_id">Category</Label>
          <Select name="category_id" defaultValue={product.category_id} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={product.description} className="min-h-[100px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) - Leave empty for "Price on Request"</Label>
          <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price || ''} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="is_active" name="is_active" defaultChecked={product.is_active} className="rounded border-zinc-300" />
          <Label htmlFor="is_active">Active</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="is_featured" name="is_featured" defaultChecked={product.is_featured} className="rounded border-zinc-300" />
          <Label htmlFor="is_featured">Featured</Label>
        </div>
      </div>

      <div className="pt-4 flex gap-4">
        <Button type="button" variant="outline" onClick={() => window.location.href='/admin/products'} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
