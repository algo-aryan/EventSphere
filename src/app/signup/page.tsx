"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore, UserRole } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ticket } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const login = useStore(state => state.login)
  const [name, setName] = useState("")
  const [role, setRole] = useState<UserRole>("attendee")

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    
    // For demo purposes, signup is just logging in
    login(name, role)
    if (role === "organiser") {
      router.push("/dashboard")
    } else {
      router.push("/events")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
          <Ticket className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground">Join EventSphere today</p>
      </div>

      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Enter your details to create your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label>I want to...</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button"
                  variant={role === "attendee" ? "default" : "outline"}
                  onClick={() => setRole("attendee")}
                >
                  Buy Tickets
                </Button>
                <Button 
                  type="button"
                  variant={role === "organiser" ? "default" : "outline"}
                  onClick={() => setRole("organiser")}
                >
                  Host Events
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg">
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
