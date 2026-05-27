"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, ShieldCheck, Ticket } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function QueuePage() {
  const router = useRouter()
  const params = useParams()
  const [progress, setProgress] = useState(0)
  const [queueNumber, setQueueNumber] = useState(14592)
  
  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 100) // 100% over ~5 seconds

    // Queue number countdown animation
    const queueInterval = setInterval(() => {
      setQueueNumber(prev => {
        if (prev <= 0) return 0
        return Math.max(0, prev - Math.floor(Math.random() * 500 + 100))
      })
    }, 200)

    // Redirect to actual checkout after 5.5 seconds
    const redirectTimer = setTimeout(() => {
      router.push(`/checkout/${params.eventId}`)
    }, 5500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(queueInterval)
      clearTimeout(redirectTimer)
    }
  }, [router, params.eventId])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center animate-in fade-in zoom-in duration-700">
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Ticket className="h-10 w-10 text-primary animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">You are in line.</h1>
          <p className="text-muted-foreground text-lg">
            Due to high demand, you have been placed in the Virtual Waiting Room. Please do not refresh this page.
          </p>
        </div>

        <Card className="border-primary/20 shadow-lg bg-background/50 backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Queue Position</span>
                <span className="text-primary font-mono">{queueNumber.toLocaleString()}</span>
              </div>
              <Progress value={progress} className="h-3 w-full" />
            </div>
            
            <div className="flex items-center justify-center text-sm text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Estimated wait time: less than a minute</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          Powered by EventSphere QueueManager™
        </div>

      </div>
    </div>
  )
}
