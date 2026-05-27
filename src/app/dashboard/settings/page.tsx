export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your organizer profile and preferences.</p>
      </div>
      <div className="border rounded-xl p-8 bg-muted/20">
        <h3 className="text-xl font-semibold mb-4">Payout Information</h3>
        <p className="text-muted-foreground mb-4">Connect your bank account to receive payouts.</p>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium">
          Connect Stripe
        </button>
      </div>
    </div>
  )
}
