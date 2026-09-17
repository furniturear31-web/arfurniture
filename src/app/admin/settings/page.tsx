import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: settings } = await supabase.from('store_settings').select('*').eq('id', true).single()

  async function updateSettings(formData: FormData) {
    'use server'
    const supabase = await createClient()
    
    const announcement_text = formData.get('announcement_text') as string
    const is_announcement_active = formData.get('is_announcement_active') === 'on'

    await supabase.from('store_settings').upsert({
      id: true,
      announcement_text,
      is_announcement_active
    })

    revalidatePath('/', 'layout')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Store Settings</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Top Announcement Bar</h2>
        <form action={updateSettings} className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <input 
              type="checkbox" 
              id="is_announcement_active" 
              name="is_announcement_active" 
              defaultChecked={settings?.is_announcement_active ?? true}
              className="w-4 h-4 text-amber-600 bg-zinc-100 border-zinc-300 rounded focus:ring-amber-500"
            />
            <Label htmlFor="is_announcement_active">Show Announcement Bar on Website</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="announcement_text">Announcement Text</Label>
            <Input 
              id="announcement_text" 
              name="announcement_text" 
              defaultValue={settings?.announcement_text || ''}
              placeholder="e.g. Festive Offer: Free Design Consultation!"
            />
          </div>
          
          <Button type="submit" className="mt-4">Save Settings</Button>
        </form>
      </div>
    </div>
  )
}
