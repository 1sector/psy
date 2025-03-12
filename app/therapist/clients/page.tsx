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

// Define the interface for the state
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
  client_id: string;
  test_id: string;
  status: string | null;
  assigned_at: string | null;
  due_date: string | null;
  clients: {
    full_name: string | null;
    users: {
      email: string | null;
    } | null;
  } | null;
  tests: {
    title: string | null;
  } | null;
}

export default function TestsManagement() {
  const [assignments, setAssignments] = useState<TestAssignment[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchAssignments = async () => {
      const { data, error } = await supabase
        .from('test_results') // Assuming this is your actual table based on the schema
        .select(`
          id,
          client_id,
          test_id,
          status,
          assigned_at,
          due_date,
          clients!client_id (
            full_name,
            users!user_id (email)
          ),
          tests!test_id (title)
        `)

      if (error) {
        console.error('Error fetching assignments:', error)
        return
      }

      if (data) {
        // Transform the data to match TestAssignment interface
        const typedData = data as SupabaseTestAssignmentRow[]
        const transformedAssignments = typedData.map((record) => {
          return {
            id: record.id || '',
            client: {
              name: record.clients?.full_name || 'N/A',
              email: record.clients?.users?.email || 'N/A',
            },
            test: {
              title: record.tests?.title || 'N/A',
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
