"use client"

import { useState } from "react"
import { ScanLine, CheckCircle2, UserCheck, Users, XCircle, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import { useStore } from "@/lib/store"

export default function CheckInPage() {
  const { purchasedTickets, checkInAttendee } = useStore()
  
  const [isScanning, setIsScanning] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const checkedInCount = purchasedTickets.filter(a => a.status === "Checked In").length
  const totalCount = purchasedTickets.length

  const handleManualCheckIn = (id: string) => {
    checkInAttendee(id, new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))
    toast.success("Attendee checked in successfully!")
  }

  const handleSimulateScan = () => {
    setIsScanning(true)
    // Simulate camera scanning delay
    setTimeout(() => {
      setIsScanning(false)
      const pendingAttendee = purchasedTickets.find(a => a.status === "Pending")
      if (pendingAttendee) {
        handleManualCheckIn(pendingAttendee.id)
        toast("QR Code Scanned!", {
          description: `${pendingAttendee.attendeeName} (${pendingAttendee.ticketTypeName}) admitted.`,
          icon: <ScanLine className="h-4 w-4 text-primary" />,
        })
      } else {
        toast.error("No pending tickets found to simulate.")
      }
    }, 1500)
  }

  const filteredAttendees = purchasedTickets.filter(a => 
    a.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Day-of-Event Check-in</h2>
          <p className="text-muted-foreground">Scan QR codes or manually admit attendees at the door.</p>
        </div>
        <div className="flex gap-4">
          <Card className="px-6 py-2 flex items-center gap-4 bg-primary text-primary-foreground border-none">
            <UserCheck className="h-8 w-8 opacity-80" />
            <div>
              <p className="text-sm font-medium opacity-80">Checked In</p>
              <p className="text-2xl font-bold">{checkedInCount} / {totalCount}</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        {/* Scanner UI */}
        <Card className="border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanLine className="h-5 w-5" /> QR Scanner
            </CardTitle>
            <CardDescription>Simulated high-speed cryptographic scanner</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[300px] bg-black rounded-xl overflow-hidden mb-6 border-4 border-muted flex items-center justify-center">
              {isScanning ? (
                <div className="absolute inset-0 bg-primary/20 animate-pulse flex items-center justify-center">
                  <div className="w-full h-1 bg-primary absolute top-1/2 -translate-y-1/2 shadow-[0_0_20px_theme(colors.primary.DEFAULT)] animate-[scan_1.5s_ease-in-out_infinite]" />
                  <span className="text-primary font-mono text-sm absolute bottom-4">ANALYZING HASH...</span>
                </div>
              ) : (
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                  <ScanLine className="h-12 w-12 opacity-50" />
                  <span className="text-sm font-medium">Camera Ready</span>
                </div>
              )}
              {/* Corner markers */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/50" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/50" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/50" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/50" />
            </div>

            <Button 
              size="lg" 
              className="w-full font-bold" 
              onClick={handleSimulateScan}
              disabled={isScanning || checkedInCount === totalCount}
            >
              {isScanning ? "Scanning..." : "Simulate QR Scan"}
            </Button>
          </CardContent>
        </Card>

        {/* Manual Check-in List */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
              <div>
                <CardTitle>Attendee List</CardTitle>
                <CardDescription>Manual override and search functionality.</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name or ID..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No attendees found matching "{searchQuery}"
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendees.map((attendee) => (
                    <TableRow key={attendee.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{attendee.id}</TableCell>
                      <TableCell className="font-bold">{attendee.attendeeName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                          {attendee.ticketTypeName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {attendee.status === "Checked In" ? (
                          <div className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-500">
                            <CheckCircle2 className="h-4 w-4" />
                            Checked In <span className="text-xs text-muted-foreground font-normal ml-1">({attendee.checkInTime})</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                            <XCircle className="h-4 w-4" />
                            Pending
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {attendee.status === "Pending" ? (
                          <Button size="sm" onClick={() => handleManualCheckIn(attendee.id)}>
                            Admit Entry
                          </Button>
                        ) : (
                          <Button size="sm" variant="secondary" disabled>
                            Admitted
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Inline styles for the scan animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  )
}
