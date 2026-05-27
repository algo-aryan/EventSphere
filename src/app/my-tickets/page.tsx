"use client"

import { QRCodeSVG } from "qrcode.react"
import { CalendarDays, MapPin, Download, Share2, Users, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useStore } from "@/lib/store"
import { toast } from "sonner"

export default function MyTicketsPage() {
  const { purchasedTickets, events, currentUser } = useStore()
  
  // Filter tickets for current user and map event details
  const myTickets = purchasedTickets
    .filter(t => t.attendeeId === currentUser?.id)
    .map(ticket => {
      const event = events.find(e => e.id === ticket.eventId)
      return {
        ...ticket,
        eventTitle: event?.title || "Unknown Event",
        date: event?.date || "Unknown Date",
        location: event?.location || "Unknown Location",
      }
    })

  // Unique event IDs the user is attending
  const myEventIds = Array.from(new Set(myTickets.map(t => t.eventId)))

  // Get networking contacts
  const networkingContacts = purchasedTickets.filter(t => 
    myEventIds.includes(t.eventId) && 
    t.attendeeId !== currentUser?.id && 
    t.shareLinkedIn
  )

  const handleFeedback = () => {
    toast.success("Feedback form opened (Simulation)")
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">My Tickets</h1>
          <p className="text-muted-foreground mt-2">View and manage your upcoming event passes.</p>
        </div>
      </div>

      <Tabs defaultValue="tickets" className="space-y-8">
        <TabsList>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="networking">Attendee Networking</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="grid gap-8 md:grid-cols-2">
          {myTickets.length === 0 && (
            <div className="col-span-2 text-center py-20 border rounded-xl bg-muted/20">
              <h3 className="text-xl font-semibold">No tickets found</h3>
              <p className="text-muted-foreground">You haven't purchased any tickets yet.</p>
            </div>
          )}
          {myTickets.map((ticket) => (
            <Card key={ticket.id} className="overflow-hidden border-primary/20 shadow-lg">
              {/* Top Section - Event Details */}
              <div className="bg-primary/5 p-6 border-b border-primary/10">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="text-xs uppercase tracking-wider">
                    {ticket.ticketTypeName}
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">{ticket.eventTitle}</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    {ticket.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {ticket.location}
                  </div>
                </div>
              </div>

              {/* Bottom Section - QR Code */}
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl mb-6">
                  <QRCodeSVG 
                    value={JSON.stringify({ t: ticket.id })}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Scan at entry. Valid for 1 attendee.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Save PDF
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="networking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#0A66C2]" /> Networking List
              </CardTitle>
              <CardDescription>Connect with other verified attendees who opted in to share their profiles.</CardDescription>
            </CardHeader>
            <CardContent>
              {networkingContacts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No other attendees have opted into networking for your events yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {networkingContacts.map((contact, i) => {
                    const eventTitle = events.find(e => e.id === contact.eventId)?.title
                    return (
                      <Card key={i} className="bg-muted/30">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-bold">{contact.attendeeName}</p>
                            <p className="text-xs text-muted-foreground mt-1">Attending: {eventTitle}</p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`https://linkedin.com/search/results/all/?keywords=${encodeURIComponent(contact.attendeeName)}`} target="_blank" rel="noopener noreferrer">
                              Connect
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Post-Event Feedback
              </CardTitle>
              <CardDescription>Help organisers improve future events by sharing your experience.</CardDescription>
            </CardHeader>
            <CardContent>
              {myEventIds.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  You haven't attended any events yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {myEventIds.map(eventId => {
                    const event = events.find(e => e.id === eventId)
                    return (
                      <div key={eventId} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{event?.title}</p>
                          <p className="text-sm text-muted-foreground">{event?.date}</p>
                        </div>
                        <Button onClick={handleFeedback}>Submit Feedback</Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
