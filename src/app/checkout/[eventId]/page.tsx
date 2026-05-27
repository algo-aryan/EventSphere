"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ShieldCheck, CreditCard, Lock, ArrowRight, CheckCircle2, Plus, Minus } from "lucide-react"
import { useStore } from "@/lib/store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"

export default function CheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const { events, currentUser, purchaseTicket } = useStore()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  // Track quantity per ticket type name
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [name, setName] = useState(currentUser?.name || "")
  const [shareLinkedIn, setShareLinkedIn] = useState(false)

  const eventId = typeof params.eventId === 'string' ? params.eventId : Array.isArray(params.eventId) ? params.eventId[0] : ""
  const event = events.find(e => e.id === eventId)

  // Initialize at least 1 ticket for the first type if nothing selected
  useEffect(() => {
    if (event && event.ticketTypes.length > 0 && Object.keys(quantities).length === 0) {
      setQuantities({ [event.ticketTypes[0].name]: 1 })
    }
  }, [event, quantities])

  if (!event) {
    return <div className="p-20 text-center">Event not found</div>
  }

  const handleQuantityChange = (typeName: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[typeName] || 0
      const next = Math.max(0, current + delta)
      return { ...prev, [typeName]: next }
    })
  }

  const subtotal = event.ticketTypes.reduce((acc, t) => acc + (t.price * (quantities[t.name] || 0)), 0)
  const totalTickets = Object.values(quantities).reduce((acc, q) => acc + q, 0)
  const fee = subtotal > 0 ? (subtotal * 0.05) + 1.50 : 0
  const total = subtotal + fee

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) {
      toast.error("Please login to purchase tickets.")
      router.push("/login")
      return
    }

    if (totalTickets === 0) {
      toast.error("Please select at least one ticket.")
      return
    }

    setIsProcessing(true)

    // Simulate network delay for Stripe verification
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      
      // Save tickets to global store
      Object.entries(quantities).forEach(([typeName, qty]) => {
        for (let i = 0; i < qty; i++) {
          purchaseTicket({
            id: `TKT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            eventId: event.id,
            attendeeId: currentUser.id,
            attendeeName: name,
            ticketTypeName: typeName,
            status: 'Pending',
            purchaseTime: new Date().toISOString(),
            shareLinkedIn
          })
        }
      })

      toast.success("Payment successful! Generating your secure tickets...")

      // Redirect to My Tickets dashboard
      setTimeout(() => {
        router.push("/my-tickets")
      }, 2000)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="animate-in zoom-in duration-500 flex flex-col items-center text-center space-y-6">
          <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 animate-bounce" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Payment Successful</h1>
          <p className="text-xl text-muted-foreground">We're generating your cryptographic QR tickets now.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Order Summary (Left Side) */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase for {event.title}</p>
          </div>

          <Card className="border-primary/20 shadow-md bg-muted/30">
            <CardHeader>
              <CardTitle>Select Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid gap-6">
                {event.ticketTypes.map(type => (
                  <div key={type.name} className="flex justify-between items-center bg-background p-3 rounded-lg border shadow-sm">
                    <div>
                      <p className="font-semibold">{type.name}</p>
                      <p className="text-sm text-muted-foreground">${type.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(type.name, -1)} disabled={(quantities[type.name] || 0) <= 0}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-4 text-center font-medium">{quantities[type.name] || 0}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(type.name, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                {Object.entries(quantities).filter(([_, q]) => q > 0).map(([tName, q]) => {
                  const tPrice = event.ticketTypes.find(t => t.name === tName)?.price || 0
                  return (
                    <div key={tName} className="flex justify-between items-center text-sm">
                      <span>{tName} x{q}</span>
                      <span>${(tPrice * q).toFixed(2)}</span>
                    </div>
                  )
                })}
                {subtotal > 0 && (
                  <div className="flex justify-between items-center text-muted-foreground text-sm pt-2">
                    <span>Processing Fee</span>
                    <span>${fee.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 py-4 border-t flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">100% Secure Checkout powered by Simulated Stripe</span>
            </CardFooter>
          </Card>
        </div>

        {/* Payment Form (Right Side) */}
        <div className="pt-8 md:pt-0">
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Contact Information</h2>
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>

            {/* Attendee Networking */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox id="network" checked={shareLinkedIn} onCheckedChange={(v) => setShareLinkedIn(v as boolean)} />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="network" className="font-semibold text-primary">Opt-in to Attendee Networking</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Share your LinkedIn profile with other verified attendees of this event.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {total > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Payment Details <Lock className="h-4 w-4 text-muted-foreground" />
                </h2>
                
                <div className="grid gap-4 p-5 border rounded-xl bg-card shadow-sm">
                  <div className="grid gap-2">
                    <Label htmlFor="card">Card number</Label>
                    <div className="relative">
                      <Input id="card" placeholder="4242 4242 4242 4242" required className="pl-10" />
                      <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" required />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full text-lg h-14 rounded-xl"
              disabled={isProcessing || totalTickets === 0}
            >
              {isProcessing ? (
                "Processing Payment..."
              ) : (
                <>
                  Pay ${total.toFixed(2)} <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              By confirming your payment, you agree to the EventSphere Terms of Service.
            </p>
          </form>
        </div>

      </div>
    </div>
  )
}
