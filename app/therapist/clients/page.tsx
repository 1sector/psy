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

// Define the interface for the expected state
interface TestAssignment {
  id: string;
  client: { name: string; email: string };
  test: { title: string };
  status: string;
  assigned_at: string;
  due_date: string;
}

// Define the interface for the raw Supabase response
interface SupabaseTestAssignmentRow {
  id: string;
  client: Array<{ name: string | null; email: string | null }>;
  test: Array<{ title: string | null }>;
  status: string | null;
  assigned_at: string | null;
  due_date: string | null;
}

export default function TestsManagement() {
  const [assignments, setAssignments] = useState<TestAssignment[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchAssignments = async () => {
      const { data, error } = await supabase
        .from('test_assignments') // Adjust table name as per your schema
        .select(`
          id,
          client:client_id (
            name,
            user:user_id (email)
          ),
          test:test_id (title),
          status,
          assigned_at,
          due_date
        `)

      if (error) {
        console.error('Error fetching assignments:', error)
        return
      }

      if (data) {
        // Transform the data to match TestAssignment interface
        const typedData = data as SupabaseTestAssignmentRow[]
        const transformedAssignments = typedData.map((record) => {
          const clientData = record.client?.[0] || { name: null, email: null }
          const testData = record.test?.[0] || { title: null }

          return {
            id: record.id,
            client: {
              name: clientData.name || 'N/A',
              email: clientData.email || 'N/A',
            },
            test: {
              title: testData.title || 'N/A',
            },
            status: record.status || 'N/A',
            assigned_at: record.assigned_at || 'N/A',
            due_date: record.due_date || 'N/A',
          }
        })

        setAssignments(transformedAssignments)
      }
    }

    fetchAssignments()
  }, [supabase])

  // Example render (adjust as needed)
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Test Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned At</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell>{assignment.client.name}</TableCell>
              <TableCell>{assignment.client.email}</TableCell>
              <TableCell>{assignment.test.title}</TableCell>
              <TableCell>{assignment.status}</TableCell>
              <TableCell>{assignment.assigned_at}</TableCell>
              <TableCell>{assignment.due_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
