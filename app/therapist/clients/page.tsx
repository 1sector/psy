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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FileText } from "lucide-react"

// Interface for clients table data
interface ClientData {
  id: string
  name: string
  email: string
  status: string
  last_session: string
}

// Interface for Supabase query response
interface ClientRecord {
  id: string;
  client: {
    full_name: string;
    user: {
      email: string;
    };
  };
  updated_at: string;
}

export default function ClientsManagement() {
  const [clients, setClients] = useState<ClientData[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchClients = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from('client_records')
        .select(`
          id,
          client:client_id (
            full_name,
            user:user_id (
              email
            )
          ),
          updated_at
        `)
        .eq('therapist_id', session.user.id)

      if (error) {
        console.error('Error fetching clients:', error)
        return
      }

      if (data) {
        const typedData = data as ClientRecord[];
        setClients(
          typedData.map(record => ({
            id: record.id,
            name: record.client?.full_name || 'N/A',
            email: record.client?.user?.email || 'N/A',
            status: 'Active',
            last_session: new Date(record.updated_at).toLocaleDateString(),
          }))
        )
      }
    }

    fetchClients()
  }, [supabase])

  const handleAssignTest = async (clientId: string) => {
    // Implement test assignment logic
  }

  const handleViewNotes = async (clientId: string) => {
    // Implement notes viewing logic
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Client Email</Label>
                <Input id="email" type="email" placeholder="Enter client email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Initial Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter initial notes about the client"
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit">Add Client</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Session</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.status}</TableCell>
              <TableCell>{client.last_session}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAssignTest(client.id)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Assign Test
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewNotes(client.id)}
                >
                  View Notes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
