import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row">
      <aside className="w-full md:w-64 border-r bg-muted/30">
        <DashboardNav />
      </aside>
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
