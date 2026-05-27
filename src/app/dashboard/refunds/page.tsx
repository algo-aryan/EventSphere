"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function RefundsPage() {
  const [requests, setRequests] = useState([
    { id: "ref_1", ticketId: "TKT-A9X7", name: "Alice Smith", amount: "$299.00", reason: "Can no longer attend", status: "Pending" },
    { id: "ref_2", ticketId: "TKT-B4Y2", name: "Bob Jones", amount: "$149.00", reason: "Purchased wrong tier", status: "Pending" },
    { id: "ref_3", ticketId: "TKT-C1Z9", name: "Charlie Day", amount: "$299.00", reason: "Medical emergency", status: "Approved" },
  ])

  const handleAction = (id: string, action: "Approved" | "Rejected") => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req))
    toast.success(`Refund request ${action.toLowerCase()} successfully.`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Refund Requests</h2>
        <p className="text-muted-foreground">Review and manage attendee ticket cancellations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending & Past Requests</CardTitle>
          <CardDescription>Approve or reject refunds. Approved refunds are automatically returned via Stripe.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Attendee Name</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono text-xs">{req.ticketId}</TableCell>
                  <TableCell className="font-medium">{req.name}</TableCell>
                  <TableCell className="text-muted-foreground">{req.reason}</TableCell>
                  <TableCell>{req.amount}</TableCell>
                  <TableCell>
                    {req.status === "Pending" && (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        <AlertCircle className="mr-1 h-3 w-3" /> Pending
                      </Badge>
                    )}
                    {req.status === "Approved" && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Approved
                      </Badge>
                    )}
                    {req.status === "Rejected" && (
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        <XCircle className="mr-1 h-3 w-3" /> Rejected
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="text-green-500 hover:text-green-600" onClick={() => handleAction(req.id, "Approved")}>Approve</Button>
                        <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" onClick={() => handleAction(req.id, "Rejected")}>Reject</Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Processed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
