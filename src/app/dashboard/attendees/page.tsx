"use client"

import { useState } from "react"
import { Download, Users } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AttendeesPage() {
  const { purchasedTickets, events, currentUser } = useStore()
  
  // Get all events owned by current user
  const myEvents = events.filter(e => e.organiserId === currentUser?.id)
  const myEventIds = myEvents.map(e => e.id)
  
  // Filter tickets to only those for my events
  const attendees = purchasedTickets.filter(t => myEventIds.includes(t.eventId))

  const exportCSV = () => {
    if (attendees.length === 0) return

    const headers = ["Ticket ID", "Event ID", "Attendee Name", "Ticket Type", "Status", "Purchase Time"]
    const rows = attendees.map(a => [
      a.id,
      a.eventId,
      a.attendeeName,
      a.ticketTypeName,
      a.status,
      new Date(a.purchaseTime).toLocaleString()
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `attendees_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendees</h2>
          <p className="text-muted-foreground">View and manage your registered attendees.</p>
        </div>
        <Button onClick={exportCSV} disabled={attendees.length === 0} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Registration List
          </CardTitle>
          <CardDescription>All users who have purchased tickets for your events.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attendee Name</TableHead>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Ticket Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Purchase Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No attendees yet. Share your event link to get registrations.
                  </TableCell>
                </TableRow>
              ) : (
                attendees.map(attendee => (
                  <TableRow key={attendee.id}>
                    <TableCell className="font-medium">{attendee.attendeeName}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{attendee.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{attendee.ticketTypeName}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={attendee.status === "Checked In" ? "default" : "secondary"}>
                        {attendee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(attendee.purchaseTime).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
