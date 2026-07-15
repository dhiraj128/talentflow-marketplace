export const billingService = {
  getInvoices: async () => {
    return new Promise((resolve) => setTimeout(() => resolve([
      { id: "INV-001", amount: "$150.00", status: "Paid", date: "2023-10-01" },
      { id: "INV-002", amount: "$300.00", status: "Pending", date: "2023-11-01" }
    ]), 600));
  }
};
