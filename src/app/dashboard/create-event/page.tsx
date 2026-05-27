"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Loader2, Sparkles, Tag } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  category: z.string().min(1, "Please select a category."),
  date: z.date({
    message: "A date of event is required.",
  }),
  isOnline: z.boolean(),
  venue: z.string().optional(),
  bulletPoints: z.string().min(10, "Please provide some basic bullet points for the AI."),
  aiDescription: z.string().optional(),
  ticketType: z.string(),
  price: z.string().optional(),
  capacity: z.string().min(1, "Capacity is required."),
  hasEarlyBird: z.boolean(),
  earlyBirdPrice: z.string().optional(),
  earlyBirdExpiry: z.date().optional(),
  hasDiscountCode: z.boolean(),
  discountCode: z.string().optional(),
  discountPercentage: z.string().optional(),
})

export default function CreateEventPage() {
  const router = useRouter()
  const { currentUser, addEvent } = useStore()
  const [isGenerating, setIsGenerating] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      isOnline: false,
      bulletPoints: "",
      aiDescription: "",
      ticketType: "PAID",
      price: "0",
      capacity: "100",
      hasEarlyBird: false,
      hasDiscountCode: false,
    },
  })

  async function generateAIDescription() {
    const { title, category, bulletPoints } = form.getValues();
    if (!bulletPoints) {
      toast.error("Please enter some raw details (bullet points) first.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, bulletPoints, tone: "Professional and Exciting" }),
      });

      const data = await res.json();
      if (res.ok) {
        form.setValue("aiDescription", data.description);
        toast.success("AI successfully drafted your event description!");
      } else {
        toast.error(data.error || "Failed to generate description");
      }
    } catch (error) {
      toast.error("Something went wrong connecting to the AI.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) {
      toast.error("You must be logged in as an organiser to create an event.")
      return
    }

    const newEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: values.title,
      category: values.category,
      date: format(values.date, "PPP"),
      time: "09:00 AM - 05:00 PM", // Mock time
      location: values.isOnline ? "Online Event" : (values.venue || "TBD"),
      description: values.aiDescription || values.bulletPoints,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop",
      organiserId: currentUser.id,
      ticketTypes: [
        { name: values.ticketType === "FREE" ? "Free Registration" : "General Admission", price: Number(values.price || 0), capacity: Number(values.capacity) }
      ],
      discountCodes: values.hasDiscountCode ? [{ code: values.discountCode || "", discount: Number(values.discountPercentage || 0) }] : []
    }
    
    addEvent(newEvent)
    toast.success("Event created successfully!")
    router.push("/dashboard")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Event</h2>
        <p className="text-muted-foreground">
          Fill out the details below. Let our AI Copilot write the perfect description for you.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
          
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>The core details of your upcoming event.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Tech Hackathon 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of event</FormLabel>
                    <Popover>
                      <PopoverTrigger render={
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        />
                      }>
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isOnline"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>This is an online event</FormLabel>
                        <FormDescription>
                          Attendees will receive a virtual meeting link.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {!form.watch("isOnline") && (
                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Silicon Valley Blvd" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/50 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>AI Copilot: Event Description</CardTitle>
              </div>
              <CardDescription>Jot down some rough ideas, and our AI will write a high-converting description for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="bulletPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raw Details / Bullet Points</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="- 3 day hackathon&#10;- $10k prize pool&#10;- Free food and swag" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                variant="secondary" 
                onClick={generateAIDescription}
                disabled={isGenerating}
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Polished Description
              </Button>

              {form.watch("aiDescription") && (
                <div className="pt-4 border-t space-y-4">
                  <FormField
                    control={form.control}
                    name="aiDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Final Description (HTML Code)</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="min-h-[200px] font-mono text-xs" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>You can edit the AI generated code before submitting.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel>Live Preview</FormLabel>
                    <div 
                      className="mt-2 p-4 border rounded-md bg-muted/30 prose dark:prose-invert max-w-none text-sm"
                      dangerouslySetInnerHTML={{ __html: form.watch("aiDescription") || "" }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Ticketing Engine</CardTitle>
              </div>
              <CardDescription>Setup your basic ticket tiers and promotional pricing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="ticketType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FREE">Free Registration</SelectItem>
                        <SelectItem value="PAID">Paid Ticket</SelectItem>
                      </SelectContent>
                    </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("ticketType") === "PAID" && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="29.99" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* EARLY BIRD SECTION */}
              {form.watch("ticketType") === "PAID" && (
                <div className="pt-4 border-t space-y-4">
                  <FormField
                    control={form.control}
                    name="hasEarlyBird"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Enable Early Bird Pricing</FormLabel>
                          <FormDescription>Automatically switch to base price after expiry.</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  {form.watch("hasEarlyBird") && (
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="earlyBirdPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Early Bird Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="19.99" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="earlyBirdExpiry"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Early Bird Expiry Date</FormLabel>
                            <Popover>
                              <PopoverTrigger render={
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                />
                              }>
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* DISCOUNT CODE SECTION */}
              {form.watch("ticketType") === "PAID" && (
                <div className="pt-4 border-t space-y-4">
                  <FormField
                    control={form.control}
                    name="hasDiscountCode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Add a Promotional Discount Code</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  {form.watch("hasDiscountCode") && (
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="discountCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code Name</FormLabel>
                            <FormControl>
                              <Input placeholder="WINTER50" className="uppercase" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="discountPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Percentage (%)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="50" max="100" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}

            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full md:w-auto">Create Event & Generate QR Codes</Button>
        </form>
      </Form>
    </div>
  )
}
