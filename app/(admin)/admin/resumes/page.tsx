import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function AdminResumesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Resume Administration</h1>
      <Tabs defaultValue="resume-orders" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="resume-orders">Resume Orders</TabsTrigger>
          <TabsTrigger value="ats-orders">ATS Orders</TabsTrigger>
          <TabsTrigger value="resume-writers">Resume Writers</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resume-orders">
          <div className="p-4 bg-card text-card-foreground rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Resume Orders</h2>
            <p className="text-muted-foreground">Manage and track all resume writing orders here.</p>
          </div>
        </TabsContent>

        <TabsContent value="ats-orders">
          <div className="p-4 bg-card text-card-foreground rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">ATS Orders</h2>
            <p className="text-muted-foreground">Manage ATS optimization requests and generation jobs.</p>
          </div>
        </TabsContent>

        <TabsContent value="resume-writers">
          <div className="p-4 bg-card text-card-foreground rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Resume Writers</h2>
            <p className="text-muted-foreground">Manage your pool of professional resume writers.</p>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="p-4 bg-card text-card-foreground rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Revenue</h2>
            <p className="text-muted-foreground">View revenue analytics for the resume center.</p>
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <div className="p-4 bg-card text-card-foreground rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Pricing</h2>
            <p className="text-muted-foreground">Configure pricing for different resume services and tiers.</p>
          </div>
        </TabsContent>

        <TabsContent value="coupons">
          <div className="p-4 bg-card text-card-foreground rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Coupons</h2>
            <p className="text-muted-foreground">Manage discount codes and promotional coupons.</p>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="p-4 bg-card text-card-foreground rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Payments</h2>
            <p className="text-muted-foreground">View and manage payment transactions.</p>
          </div>
        </TabsContent>

        <TabsContent value="refunds">
          <div className="p-4 bg-card text-card-foreground rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Refunds</h2>
            <p className="text-muted-foreground">Process and track customer refunds.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
