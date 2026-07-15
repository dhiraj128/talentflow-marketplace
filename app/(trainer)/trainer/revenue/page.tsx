import { PageHeader } from "@/components/shared/PageHeader"
import { StatsGrid } from "@/components/shared/StatsGrid"
import { DollarSign, ArrowUpRight, Wallet, History, Building } from "lucide-react"
import { DataTable } from "@/components/shared/DataTable"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RevenuePage() {
  const stats = [
    { label: "Total Earnings", value: "$42,500", icon: <DollarSign className="h-4 w-4" />, change: "+$2,400 this month" },
    { label: "Available Balance", value: "$3,250", icon: <Wallet className="h-4 w-4" />, change: "Ready for withdrawal" },
    { label: "Next Payout", value: "$1,200", icon: <ArrowUpRight className="h-4 w-4" />, change: "Scheduled for Oct 1st" },
  ]

  const columns = [
    { header: "Transaction ID", accessor: "id" },
    { header: "Date", accessor: "date" },
    { header: "Description", accessor: "description" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
  ]

  const data = [
    { id: "TX-9823", date: "Sep 28, 2023", description: "Course Sale: Advanced React", amount: "+$149.00", status: "Completed" },
    { id: "TX-9822", date: "Sep 27, 2023", description: "Live Session: Q&A", amount: "+$45.00", status: "Completed" },
    { id: "TX-9821", date: "Sep 25, 2023", description: "Withdrawal to Bank Account", amount: "-$2,000.00", status: "Processed" },
    { id: "TX-9820", date: "Sep 24, 2023", description: "Course Sale: Next.js Mastery", amount: "+$199.00", status: "Completed" },
    { id: "TX-9819", date: "Sep 22, 2023", description: "Course Sale: Advanced React", amount: "+$149.00", status: "Refunded" },
  ]

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
            <DataTable columns={columns} data={data} />
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Payout Method</CardTitle>
              <CardDescription>Where your funds are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                <Building className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">HDFC Bank</p>
                  <p className="text-sm text-muted-foreground">Ending in •••• 4589</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">Update Bank Details</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Course Sales</span>
                <span className="font-medium">$32,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Live Classes</span>
                <span className="font-medium">$8,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">1-on-1 Mentorship</span>
                <span className="font-medium">$2,000</span>
              </div>
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-bold text-primary">$42,500</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
