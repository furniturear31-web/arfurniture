'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating order:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/orders')
  return { success: true }
}
