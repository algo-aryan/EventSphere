export default function MyEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Events</h2>
        <p className="text-muted-foreground">Manage your active and past events.</p>
      </div>
      <div className="border rounded-xl p-8 text-center bg-muted/20">
        <h3 className="text-xl font-semibold mb-2">No events created yet</h3>
        <p className="text-muted-foreground">Go to "Create Event" to get started.</p>
      </div>
    </div>
  )
}
