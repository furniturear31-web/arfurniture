'use client'

import { useState } from 'react'
import { addProduct } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ProductForm({ categories }: { categories: any[] }) {
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    
    const formData = new FormData(event.currentTarget)
    const result = await addProduct(formData)
    
    setLoading(false)
    if (result.success) {
      // reset form or redirect
      window.location.reload()
    } else {
      alert(result.error)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category_id">Category</Label>
          <Select name="category_id" required>
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
        <Textarea id="description" name="description" className="min-h-[100px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) - Leave empty for "Price on Request"</Label>
          <Input id="price" name="price" type="number" step="0.01" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Product Images (Will be auto-cropped to 1:1)</Label>
        <Input id="images" name="images" type="file" multiple accept="image/*" required />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="is_active" name="is_active" defaultChecked className="rounded border-zinc-300" />
          <Label htmlFor="is_active">Active</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="is_featured" name="is_featured" className="rounded border-zinc-300" />
          <Label htmlFor="is_featured">Featured</Label>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Publishing Product...' : 'Publish Product'}
      </Button>
    </form>
  )
}
