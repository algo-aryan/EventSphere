"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarDays, MapPin, Sparkles, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import { useStore } from "@/lib/store"

export default function DiscoveryHubPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [cityFilter, setCityFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [freeFilter, setFreeFilter] = useState(false)
  const [paidFilter, setPaidFilter] = useState(false)
  
  const events = useStore(state => state.events)
  const purchasedTickets = useStore(state => state.purchasedTickets)
  const currentUser = useStore(state => state.currentUser)

  // AI Recommendation Logic based on past purchases
  const myPurchased = purchasedTickets.filter(t => t.attendeeId === currentUser?.id)
  const categoryCounts = myPurchased.reduce((acc, t) => {
    const event = events.find(e => e.id === t.eventId)
    if (event) acc[event.category] = (acc[event.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const recommendedEvents = topCategory 
    ? events.filter(e => e.category === topCategory) 
    : events.slice(0, 4)

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || event.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesCity = !cityFilter || event.location.toLowerCase().includes(cityFilter.toLowerCase())
    const matchesDate = !dateFilter || event.date.toLowerCase().includes(dateFilter.toLowerCase())
    
    const hasFreeTickets = event.ticketTypes.some(t => t.price === 0)
    const hasPaidTickets = event.ticketTypes.some(t => t.price > 0)
    
    let matchesPrice = true;
    if (freeFilter && !paidFilter) matchesPrice = hasFreeTickets;
    if (!freeFilter && paidFilter) matchesPrice = hasPaidTickets;
    
    return matchesSearch && matchesCategory && matchesCity && matchesDate && matchesPrice
  })

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Discover Events</h1>
          <p className="text-muted-foreground mt-1 text-lg">Find your next incredible experience.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2">
          <Input 
            placeholder="Search events..." 
            className="md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Events</SheetTitle>
                <SheetDescription>Narrow down your search.</SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input 
                    placeholder="e.g. San Francisco" 
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date (Month or Year)</Label>
                  <Input 
                    placeholder="e.g. October" 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <Label>Price</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="free" checked={freeFilter} onCheckedChange={(c) => setFreeFilter(c as boolean)} />
                    <label htmlFor="free" className="text-sm font-medium leading-none">Free</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="paid" checked={paidFilter} onCheckedChange={(c) => setPaidFilter(c as boolean)} />
                    <label htmlFor="paid" className="text-sm font-medium leading-none">Paid</label>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Recommended Section (AI Feature) */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Top Picks For You (AI Recommended)</h2>
        </div>
        {recommendedEvents.length === 0 ? (
           <p className="text-muted-foreground">Book some tickets to get personalized recommendations!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedEvents.map((event) => (
              <EventCard key={`rec-${event.id}`} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Events</h2>
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 border rounded-xl bg-muted/20">
            <h3 className="text-xl font-semibold">No events found</h3>
            <p className="text-muted-foreground">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EventCard({ event }: { event: any }) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <Badge className="absolute top-3 left-3" variant="secondary">
            {event.category}
          </Badge>
          <Badge className="absolute top-3 right-3" variant={event.ticketTypes[0]?.price === 0 ? "default" : "secondary"}>
            {event.ticketTypes[0]?.price === 0 ? "Free" : "Paid"}
          </Badge>
        </div>
        <CardHeader className="p-4 flex-1">
          <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2 text-sm text-muted-foreground flex-none">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full" variant="outline">View Details</Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
