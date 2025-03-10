"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/')
        return
      }

      setIsAdmin(true)
      setIsLoading(false)
    }

    checkAdmin()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-card border-r">
        <nav className="p-4 space-y-2">
          <a href="/admin" className="block p-2 hover:bg-accent rounded-md">Dashboard</a>
          <a href="/admin/tests" className="block p-2 hover:bg-accent rounded-md">Tests</a>
          <a href="/admin/users" className="block p-2 hover:bg-accent rounded-md">Users</a>
          <a href="/admin/meditations" className="block p-2 hover:bg-accent rounded-md">Meditations</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}