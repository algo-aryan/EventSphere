import { create } from 'zustand'

export type UserRole = 'attendee' | 'organiser' | null

export type TicketType = {
  name: string
  price: number
  capacity: number
}

export type Event = {
  id: string
  title: string
  category: string
  date: string
  time: string
  location: string
  description: string
  image: string
  organiserId: string
  ticketTypes: TicketType[]
  discountCodes: { code: string, discount: number }[]
}

export type TicketPurchase = {
  id: string
  eventId: string
  attendeeId: string
  attendeeName: string
  ticketTypeName: string
  status: 'Pending' | 'Checked In'
  purchaseTime: string
  checkInTime?: string
  shareLinkedIn: boolean
}

export type Review = {
  eventId: string
  attendeeId: string
  rating: number
  text: string
}

interface AppState {
  // Auth State
  currentUser: { id: string; name: string; role: UserRole } | null
  login: (name: string, role: UserRole) => void
  logout: () => void

  // Data Store
  events: Event[]
  purchasedTickets: TicketPurchase[]
  reviews: Review[]

  wishlist: string[]

  // Actions
  addEvent: (event: Event) => void
  purchaseTicket: (ticket: TicketPurchase) => void
  checkInAttendee: (ticketId: string, time: string) => void
  addReview: (review: Review) => void
  addToWishlist: (eventId: string) => void
  removeFromWishlist: (eventId: string) => void
}

export const useStore = create<AppState>((set) => ({
  currentUser: { id: "att1", name: "Demo User", role: 'attendee' },
  login: (name, role) => set({ currentUser: { id: Math.random().toString(36).substr(2, 9), name, role } }),
  logout: () => set({ currentUser: null }),

  events: [
    {
      id: "1",
      title: "Global Tech Summit 2026",
      category: "Technology",
      date: "October 15-17, 2026",
      time: "09:00 AM - 06:00 PM PST",
      location: "Moscone Center, San Francisco, CA",
      description: "Join us for the premier technology conference of the year.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop",
      organiserId: "org1",
      ticketTypes: [
        { name: "General Admission", price: 299, capacity: 500 },
        { name: "VIP Pass", price: 999, capacity: 50 }
      ],
      discountCodes: [{ code: "EARLYBIRD", discount: 20 }]
    }
  ],
  purchasedTickets: [
    {
      id: "TKT-MOCK-123",
      eventId: "1",
      attendeeId: "att1",
      attendeeName: "John Doe",
      ticketTypeName: "General Admission",
      status: "Pending",
      purchaseTime: new Date().toISOString(),
      shareLinkedIn: true
    }
  ],
  reviews: [
    { eventId: "1", attendeeId: "att1", rating: 5, text: "The keynote was absolutely incredible. Learned so much about the future of AI." },
    { eventId: "1", attendeeId: "att2", rating: 3, text: "Food ran out during lunch which was frustrating. But the networking sessions were 10/10." },
  ],

  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  purchaseTicket: (ticket) => set((state) => ({ purchasedTickets: [...state.purchasedTickets, ticket] })),
  checkInAttendee: (ticketId, time) => set((state) => ({
    purchasedTickets: state.purchasedTickets.map(t => 
      t.id === ticketId ? { ...t, status: 'Checked In', checkInTime: time } : t
    )
  })),
  addReview: (review) => set((state) => ({ reviews: [...state.reviews, review] })),
  
  wishlist: ["1"], // mock initial wishlist
  addToWishlist: (eventId) => set((state) => ({ 
    wishlist: state.wishlist.includes(eventId) ? state.wishlist : [...state.wishlist, eventId] 
  })),
  removeFromWishlist: (eventId) => set((state) => ({ 
    wishlist: state.wishlist.filter(id => id !== eventId) 
  })),
}))
