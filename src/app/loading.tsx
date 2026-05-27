import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background fixed inset-0 z-50">
      <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-500">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Loading EventSphere...</h2>
        <p className="text-sm text-muted-foreground animate-pulse">Initializing components</p>
      </div>
    </div>
  )
}
