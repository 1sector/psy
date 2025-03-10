"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, FileText, Brain } from "lucide-react"

export default function TherapistDashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeTests: 0,
    completedTests: 0,
    upcomingSessions: 0
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { count: clientsCount } = await supabase
        .from('client_records')
        .select('*', { count: 'exact' })
        .eq('therapist_id', session.user.id)

      const { count: activeTestsCount } = await supabase
        .from('test_assignments')
        .select('*', { count: 'exact' })
        .eq('therapist_id', session.user.id)
        .eq('status', 'assigned')

      setStats({
        totalClients: clientsCount || 0,
        activeTests: activeTestsCount || 0,
        completedTests: 45,
        upcomingSessions: 3
      })
    }

    fetchStats()
  }, [supabase])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Therapist Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}