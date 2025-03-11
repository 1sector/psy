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

interface TestAssignment {
  id: string;
  client: { name: string; email: string };
  test: { title: string };
  status: string;
  assigned_at: string;
  due_date: string;
}

export default function TestAssignments() {
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
            email,
            name
          ),
          test:test_id (
            title
          ),
          status,
          assigned_at,
          due_date
        `)
        .eq('therapist_id', session.user.id)

      if (data) {
        setAssignments(
          data.map((record: any) => ({
            id: record.id,
            // Извлекаем первого клиента и тест из массивов
            client: record.client[0],
            test: record.test[0],
            status: record.status,
            assigned_at: record.assigned_at,
            due_date: record.due_date,
          }))
        )
      }
    }

    fetchAssignments()
  }, [supabase])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Test Assignments</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Client Email</TableHead>
            <TableHead>Test Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned At</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map(assignment => (
            <TableRow key={assignment.id}>
              <TableCell>{assignment.client.name}</TableCell>
              <TableCell>{assignment.client.email}</TableCell>
              <TableCell>{assignment.test.title}</TableCell>
              <TableCell>{assignment.status}</TableCell>
              <TableCell>{new Date(assignment.assigned_at).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(assignment.due_date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
