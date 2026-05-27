"use client"

import { useStore } from "@/lib/store"
import Link from "next/link"
import { CalendarDays, MapPin, Heart, BellRing } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function WishlistPage() {
  const { wishlist, events, removeFromWishlist } = useStore()
  
  const wishlistedEvents = events.filter(e => wishlist.includes(e.id))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Wishlist</h2>
          <p className="text-muted-foreground">Events you are interested in attending.</p>
        </div>
      </div>

      {wishlistedEvents.length > 0 && (
        <Card className="bg-primary/5 border-primary/20 mb-6">
          <CardContent className="p-4 flex items-center gap-4">
            <BellRing className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-primary">Reminder System Active</p>
              <p className="text-sm text-muted-foreground">You will be notified 48 hours before any of these events begin or if ticket supplies run low.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {wishlistedEvents.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/20">
          <h3 className="text-xl font-semibold">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-4">Discover new events and save them for later.</p>
          <Link href="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedEvents.map((event) => (
            <Card key={`wishlist-${event.id}`} className="overflow-hidden group flex flex-col h-full">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute top-3 right-3 h-8 w-8 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(event.id);
                  }}
                >
                  <Heart className="h-4 w-4 fill-current text-red-500" />
                </Button>
              </div>
              <CardHeader className="p-4 flex-1">
                <h3 className="text-xl font-bold line-clamp-2">{event.title}</h3>
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
                <Link href={`/events/${event.id}`}>
                  <Button className="w-full" variant="default">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
