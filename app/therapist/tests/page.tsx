"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface TestAssignment {
  id: string
  client: {
    name: string
    email: string
  }
  test: {
    title: string
  }
  status: string
  assigned_at: string
  due_date: string
}

export default function TestsOverview() {
  const [assignments, setAssignments] = useState<TestAssignment[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchAssignments = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from('test_assignments')
        .select(`
          id,
          client:client_id (
            name,
            email
          ),
          test:test_id (
            title
          ),
          status,
          assigned_at,
          due_date
        `)
        .eq('therapist_id', session.user.id)
        .order('assigned_at', { ascending: false })

      if (data) {
        setAssignments(data)
      }
    }

    fetchAssignments()
  }, [supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'assigned':
        return 'bg-blue-500'
      case 'expired':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleViewResults = async (assignmentId: string) => {
    // Implementation for viewing test results
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Test Assignments</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Test</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{assignment.client.name}</div>
                  <div className="text-sm text-muted-foreground">{assignment.client.email}</div>
                </div>
              </TableCell>
              <TableCell>{assignment.test.title}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={getStatusColor(assignment.status)}>
                  {assignment.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(assignment.assigned_at).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(assignment.due_date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewResults(assignment.id)}
                  disabled={assignment.status !== 'completed'}
                >
                  View Results
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}