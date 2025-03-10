"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2, Users, FileText, Brain, Home } from "lucide-react"

export default function TherapistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isTherapist, setIsTherapist] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkTherapist = async () => {
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

      if (profile?.role !== 'therapist') {
        router.push('/')
        return
      }

      setIsTherapist(true)
      setIsLoading(false)
    }

    checkTherapist()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isTherapist) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-card border-r">
        <nav className="p-4 space-y-2">
          <a href="/therapist" className="flex items-center p-2 hover:bg-accent rounded-md">
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </a>
          <a href="/therapist/clients" className="flex items-center p-2 hover:bg-accent rounded-md">
            <Users className="h-4 w-4 mr-2" />
            Clients
          </a>
          <a href="/therapist/tests" className="flex items-center p-2 hover:bg-accent rounded-md">
            <FileText className="h-4 w-4 mr-2" />
            Tests
          </a>
          <a href="/therapist/sessions" className="flex items-center p-2 hover:bg-accent rounded-md">
            <Brain className="h-4 w-4 mr-2" />
            Sessions
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}