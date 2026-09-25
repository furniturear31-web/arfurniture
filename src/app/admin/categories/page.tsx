import { createClient } from '@/lib/supabase/server'
import { CategoryForm } from './CategoryForm'
import { deleteCategory } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2 } from 'lucide-react'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: rawCategories } = await supabase.from('categories').select('*').order('created_at', { ascending: false })

  const categories = rawCategories?.sort((a, b) => {
    if (a.slug === 'sofa') return -1
    if (b.slug === 'sofa') return 1
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Categories</h1>
        <p className="text-zinc-500">Manage product categories.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{cat.slug}</TableCell>
                  <TableCell>{cat.is_active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell className="text-right">
                    <form action={async () => {
                      'use server'
                      await deleteCategory(cat.id)
                    }}>
                      <Button variant="destructive" size="icon" type="submit">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {(!categories || categories.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-zinc-500">
                    No categories found.
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
