import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '../../components/layout/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  return (
    <div style={{ display:'flex', height:'100vh', background:'#080C0C', overflow:'hidden' }}>
      <Sidebar />
      <main style={{ flex:1, overflowY:'auto', background:'#080C0C' }}>
        {children}
      </main>
    </div>
  )
}