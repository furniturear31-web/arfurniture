import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminClientLayout from './AdminClientLayout'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  async function signOutAction() {
    'use server'
    const sb = await createClient()
    await sb.auth.signOut()
    redirect('/login')
  }

  return (
    <AdminClientLayout signOutAction={signOutAction}>
      {children}
    </AdminClientLayout>
  )
}
