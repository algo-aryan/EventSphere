"use client"

import { useParams } from "next/navigation"
import { CalendarDays, Clock, MapPin, Share2, Heart, ShieldCheck, Ticket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "sonner"
import { useStore } from "@/lib/store"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

export default function EventDetailPage() {
  const params = useParams()
  const eventId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : "1"
  
  const { events, wishlist, addToWishlist, removeFromWishlist, currentUser, purchasedTickets, reviews, addReview } = useStore()
  
  // Real data fetching based on ID from store
  const event = events.find(e => e.id === eventId) || events[0]
  
  const isWishlisted = wishlist.includes(event.id)
  
  const [newReview, setNewReview] = useState("")
  const [rating, setRating] = useState(5)
  
  const eventReviews = reviews.filter(r => r.eventId === event.id)
  
  // Check if current user can review (must be checked in)
  const canReview = currentUser && purchasedTickets.some(t => t.eventId === event.id && t.attendeeId === currentUser.id && t.status === "Checked In")


  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(event.id)
      toast("Removed from wishlist")
    } else {
      addToWishlist(event.id)
      toast.success("Added to your wishlist! We'll remind you before tickets sell out.")
    }
  }

  const handleReviewSubmit = () => {
    if (!currentUser) return
    addReview({
      eventId: event.id,
      attendeeId: currentUser.id,
      rating,
      text: newReview
    })
    setNewReview("")
    toast.success("Review submitted successfully!")
  }

  return (
    <div className="pb-20">
      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-muted">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
          <Badge className="mb-4">{event.category}</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground sm:text-lg">
            <div className="flex items-center gap-2"><CalendarDays className="h-5 w-5" /> {event.date}</div>
            <div className="flex items-center gap-2"><Clock className="h-5 w-5" /> {event.time}</div>
            <div className="flex items-center gap-2"><MapPin className="h-5 w-5" /> {event.location}</div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: event.description }} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Agenda & Speakers</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Keynote: The Future of AI</CardTitle>
                    <Badge variant="outline">09:00 AM</Badge>
                  </div>
                  <CardDescription>Main Stage</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  A deep dive into generative models and their impact on software development over the next decade.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Serverless Architectures at Scale</CardTitle>
                    <Badge variant="outline">11:30 AM</Badge>
                  </div>
                  <CardDescription>Room B</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Learn how to build resilient systems using modern edge computing and serverless databases.
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Venue Map</h2>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted border flex items-center justify-center">
              {/* Simulated Google Maps iframe */}
              <div className="text-center text-muted-foreground">
                <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Interactive Map Integration</p>
                <p className="text-sm">Moscone Center, San Francisco</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion className="w-full border rounded-xl px-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is there parking available?</AccordionTrigger>
                <AccordionContent>
                  Yes, the venue has a paid parking garage attached. Early arrival is recommended.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Are meals included?</AccordionTrigger>
                <AccordionContent>
                  VIP ticket holders receive catered lunch. General admission includes coffee and light snacks.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I get a refund?</AccordionTrigger>
                <AccordionContent>
                  Refunds are available up to 7 days before the event start date via the attendee dashboard.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>
            <div className="space-y-6">
              {eventReviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet for this event.</p>
              ) : (
                eventReviews.map((r, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Attendee {r.attendeeId}</span>
                        <div className="flex text-yellow-500">
                          {Array.from({length: 5}).map((_, j) => (
                            <span key={j} className={j < r.rating ? "opacity-100" : "opacity-30"}>★</span>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      "{r.text}"
                    </CardContent>
                  </Card>
                ))
              )}

              {canReview && (
                <Card className="mt-8 bg-muted/20 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Leave a Review</CardTitle>
                    <CardDescription>Share your experience with others.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Rating:</span>
                      <select 
                        value={rating} 
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="bg-background border rounded px-2 py-1 text-sm"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <Textarea 
                      placeholder="Write your review here..." 
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                    />
                    <Button onClick={handleReviewSubmit} disabled={!newReview.trim()}>Submit Review</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        </div>

        {/* Sticky Sidebar (Ticketing) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card className="border-primary/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl">{event.price}</CardTitle>
                <CardDescription>General Admission Ticket</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Button className="w-full flex-1" size="lg" onClick={() => window.location.href = `/checkout/${event.id}/queue`}>
                    <Ticket className="mr-2 h-5 w-5" /> Buy Tickets
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <Button variant={isWishlisted ? "default" : "outline"} className="w-full" onClick={handleWishlist}>
                    <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} /> 
                    {isWishlisted ? "Wishlisted" : "Wishlist"}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="p-4 flex items-start gap-4">
                <ShieldCheck className="h-6 w-6 text-green-500 shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold">Secure Checkout</p>
                  <p className="text-muted-foreground mt-1">Your payment information is encrypted and securely processed via Stripe.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}
