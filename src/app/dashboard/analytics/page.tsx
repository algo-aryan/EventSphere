"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Users, MessageSquareText, Sparkles, Loader2, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function AnalyticsPage() {
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)

  // Simulated Reviews Data
  const rawReviews = [
    "The keynote was absolutely incredible. Learned so much about the future of AI.",
    "Food ran out during lunch which was frustrating. But the networking sessions were 10/10.",
    "Great event, very well organized. Wish there was more time for Q&A after sessions.",
    "Best tech conference I've attended this year. Venue was beautiful.",
    "Good speakers, but the wifi was terrible the whole day.",
  ]

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const response = await fetch('/api/ai/sentiment-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviews: rawReviews }),
        })
        const data = await response.json()
        setAiSummary(data.summary)
      } catch (error) {
        console.error("Failed to fetch sentiment:", error)
        setAiSummary("Failed to generate AI summary.")
      } finally {
        setIsGenerating(false)
      }
    }

    fetchSentiment()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Post-Event Analytics</h2>
        <p className="text-muted-foreground">Review attendee satisfaction and AI-driven feedback insights.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 flex flex-row justify-between items-center space-y-0">
            <CardTitle className="text-sm font-medium">Net Promoter Score (NPS)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">+74</div>
            <p className="text-xs text-muted-foreground mt-1">Excellent (Top 5% of events)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row justify-between items-center space-y-0">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.8 / 5.0</div>
            <p className="text-xs text-muted-foreground mt-1">Based on 412 reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row justify-between items-center space-y-0">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquareText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground mt-1">412 of 500 attendees</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Sentiment Analysis Section */}
      <Card className="border-primary/20 shadow-md bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" /> 
            AI Sentiment Analysis
          </CardTitle>
          <CardDescription>Gemini AI has analyzed all {rawReviews.length} raw text reviews to extract the core insights.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-background rounded-xl border shadow-sm">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="animate-pulse">Processing hundreds of reviews via Gemini AI...</p>
              </div>
            ) : (
              <p className="text-lg leading-relaxed text-foreground font-medium">
                "{aiSummary}"
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Raw Reviews Data Table (Simulated snippet) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Raw Feedback</CardTitle>
          <CardDescription>Read individual qualitative responses from attendees.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rawReviews.map((review, i) => (
              <div key={i} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex shrink-0 gap-1 pt-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className={cn("h-3 w-3", star === 5 && i === 1 ? "fill-muted text-muted" : "fill-yellow-500 text-yellow-500")} />
                  ))}
                </div>
                <p className="text-sm">{review}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
