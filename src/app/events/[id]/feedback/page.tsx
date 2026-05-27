"use client"

import { useState } from "react"
import { Star, MessageSquareHeart, Send, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error("Please select a star rating.")
      return
    }
    
    setIsSubmitting(true)
    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      toast.success("Thank you for your feedback!")
    }, 1200)
  }

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="animate-in zoom-in duration-500 flex flex-col items-center text-center space-y-6">
          <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 animate-bounce" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Feedback Submitted</h1>
          <p className="text-xl text-muted-foreground">Thank you! Your review helps organizers create better experiences.</p>
          <Button variant="outline" onClick={() => window.location.href = '/events/1'}>
            Return to Event Page
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Rate Your Experience</h1>
        <p className="text-muted-foreground">Global Tech Summit 2026</p>
      </div>

      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="flex justify-center items-center gap-2">
            <MessageSquareHeart className="h-5 w-5 text-primary" /> Overall Satisfaction
          </CardTitle>
          <CardDescription>How would you rate the event overall?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8 mt-6">
            
            {/* Star Rating */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-hidden transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star 
                    className={cn(
                      "h-12 w-12 transition-colors",
                      (hoverRating || rating) >= star 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "fill-muted text-muted-foreground opacity-30"
                    )} 
                  />
                </button>
              ))}
            </div>

            {/* Text Review */}
            <div className="space-y-3">
              <Label htmlFor="review" className="text-base font-semibold">Write a review</Label>
              <Textarea 
                id="review" 
                placeholder="What did you love? What could be improved?" 
                className="min-h-[150px] resize-none"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Your feedback will be shared anonymously with the organizers.</p>
            </div>

            <Button 
              type="submit" 
              className="w-full text-lg h-14 rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  Submit Feedback <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
