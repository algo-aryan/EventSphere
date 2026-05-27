"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Ticket, Calendar, Users, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-3xl px-4"
      >
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
          DevFusion 2.0 Hackathon Submission
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Next-Gen Event Management & <br className="hidden md:block"/>
          <span className="text-primary">Intelligent Ticketing</span>
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Create, manage, and discover events effortlessly. Powered by advanced AI 
          for hyper-personalized recommendations and smart scheduling.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/events">
            <Button size="lg" className="w-full sm:w-auto group">
              Discover Events
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Host an Event
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 px-8 max-w-6xl w-full"
      >
        <FeatureCard 
          icon={<Ticket className="h-10 w-10 text-primary mb-4" />}
          title="Smart Ticketing"
          description="Dynamic pricing, anti-fraud QR codes, and multi-tier ticketing logic."
        />
        <FeatureCard 
          icon={<Zap className="h-10 w-10 text-primary mb-4" />}
          title="AI Copilot"
          description="Generative descriptions and intelligent schedule building for organizers."
        />
        <FeatureCard 
          icon={<Calendar className="h-10 w-10 text-primary mb-4" />}
          title="Live Check-in"
          description="Real-time WebSockets sync and web-based QR scanning at the door."
        />
        <FeatureCard 
          icon={<Users className="h-10 w-10 text-primary mb-4" />}
          title="Community"
          description="Post-event networking, reviews, and hyper-personalized discovery."
        />
      </motion.div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-start p-6 bg-card border rounded-xl shadow-sm">
      {icon}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
