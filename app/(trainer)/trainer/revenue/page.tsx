"use client";

import { PageHeader } from "@/components/shared/PageHeader"
import { StatsGrid } from "@/components/shared/StatsGrid"
import { DollarSign, ArrowUpRight, Wallet, History } from "lucide-react"
import { DataTable } from "@/components/shared/DataTable"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RevenuePage() {
  const stats = [
    { label: "Total Earnings", value: "$0.00", icon: <DollarSign className="h-4 w-4" />, change: "No earnings yet" },
    { label: "Available Balance", value: "$0.00", icon: <Wallet className="h-4 w-4" />, change: "Ready for withdrawal" },
    { label: "Next Payout", value: "$0.00", icon: <ArrowUpRight className="h-4 w-4" />, change: "No scheduled payouts" },
  ]

  const columns = [
    { header: "Transaction ID", accessor: "id" },
    { header: "Date", accessor: "date" },
    { header: "Description", accessor: "description" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
  ]

  const data: any[] = [];

  return (
    <>
      <PageHeader 
        title="Finance Dashboard" 
        description="Manage your revenue, withdrawals, and transaction history." 
        action={<Button><Wallet className="mr-2 h-4 w-4"/> Withdraw Funds</Button>}
      />
      
      <StatsGrid stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Recent sales and withdrawals</CardDescription>
              </div>
              <Button variant="outline" size="sm"><History className="mr-2 h-4 w-4"/> Export CSV</Button>
            </div>
          </CardHeader>
          <CardContent>
            {data.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <p className="font-medium text-sm">No transactions yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Course sales and payouts will appear here.</p>
              </div>
            ) : (
              <DataTable columns={columns} data={data} />
            )}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Payout Method</CardTitle>
              <CardDescription>Where your funds are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">No payout method added yet.</p>
              <Button variant="outline" className="w-full">Add Bank Details</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Course Sales</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Live Classes</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-bold text-primary">$0.00</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
