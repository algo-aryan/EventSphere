"use client"

import { DollarSign, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function PayoutsPage() {
  const payouts = [
    { id: "po_1", date: "May 20, 2026", amount: "$12,450.00", status: "Paid", account: "Stripe •••• 4242" },
    { id: "po_2", date: "May 15, 2026", amount: "$8,200.00", status: "Paid", account: "Stripe •••• 4242" },
    { id: "po_3", date: "May 10, 2026", amount: "$5,100.00", status: "Paid", account: "Stripe •••• 4242" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payouts & Finance</h2>
        <p className="text-muted-foreground">Manage your earnings, simulated Stripe balance, and payout history.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80">Available to Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$4,320.50</div>
            <Button variant="secondary" className="mt-4 w-full text-primary font-bold">
              Initiate Transfer <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row justify-between items-center space-y-0">
            <CardTitle className="text-sm font-medium">Pending Clearing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$1,250.00</div>
            <p className="text-xs text-muted-foreground mt-1">Available in 2-3 business days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row justify-between items-center space-y-0">
            <CardTitle className="text-sm font-medium">Total Lifetime Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$25,750.00</div>
            <p className="text-xs text-muted-foreground mt-1">Across 4 completed events</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payouts</CardTitle>
          <CardDescription>A history of transfers sent to your connected Stripe account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payout ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-mono text-xs">{payout.id}</TableCell>
                  <TableCell>{payout.date}</TableCell>
                  <TableCell className="text-muted-foreground">{payout.account}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">{payout.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
