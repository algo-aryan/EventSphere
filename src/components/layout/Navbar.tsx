"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Ticket, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

export function Navbar() {
  const pathname = usePathname()
  const { currentUser, logout } = useStore()

  // Don't show navbar on auth pages
  if (pathname === '/login' || pathname === '/signup') return null

  return (
    <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Ticket className="h-6 w-6 text-primary" />
          EventSphere
        </Link>
        
        <div className="flex items-center gap-4">
          {!currentUser ? (
            <>
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {currentUser.role === 'organiser' ? (
                <>
                  <Link href="/dashboard" className="text-sm font-medium hover:text-primary">Dashboard</Link>
                  <Link href="/dashboard/create-event" className="text-sm font-medium hover:text-primary">Create Event</Link>
                </>
              ) : (
                <>
                  <Link href="/events" className="text-sm font-medium hover:text-primary">Browse Events</Link>
                  <Link href="/my-tickets" className="text-sm font-medium hover:text-primary">My Tickets</Link>
                </>
              )}
              
              <div className="flex items-center gap-2 ml-4 pl-4 border-l">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-semibold">{currentUser.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{currentUser.role}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => logout()}>
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
