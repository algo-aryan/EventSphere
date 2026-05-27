"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PlusCircle, Ticket, Settings, Users, QrCode } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create Event", href: "/dashboard/create-event", icon: PlusCircle },
    { name: "My Events", href: "/dashboard/events", icon: Ticket },
    { name: "Attendees", href: "/dashboard/attendees", icon: Users },
    { name: "Check-In Scanner", href: "/dashboard/check-in", icon: QrCode },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <nav className="grid items-start gap-2 p-4">
      {links.map((link) => {
        const Icon = link.icon
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname === link.href 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-primary"
            }`}
          >
            <Icon className="h-4 w-4" />
            {link.name}
          </Link>
        )
      })}
    </nav>
  )
}
