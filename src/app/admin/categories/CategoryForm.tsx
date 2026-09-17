'use client'

import { useState } from 'react'
import { addCategory } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function CategoryForm() {
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    const result = await addCategory(formData)
    setLoading(false)
    if (result.success) {
      // maybe show toast or reset form
    }
  }

  return (
    <form action={onSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Category'}
      </Button>
    </form>
  )
}
