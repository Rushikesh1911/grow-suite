import { Invoice } from "@/components/invoices/invoice";

export default function InvoicesPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage and view your invoices</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            Filter
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            New Invoice
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <Invoice
          invoiceNumber="INV-2023-001"
          issueDate="2023-11-15"
          dueDate="2023-12-15"
          status="pending"
          from={{
            name: "Acme Inc.",
            address: "123 Business St, San Francisco, CA 94103",
            email: "billing@acme.com",
            phone: "(555) 123-4567"
          }}
          to={{
            name: "John Doe",
            email: "john@example.com",
            address: "456 Client Ave, New York, NY 10001"
          }}
          items={[
            {
              id: "1",
              description: "Website Redesign",
              quantity: 1,
              unitPrice: 5000,
              amount: 5000
            },
            {
              id: "2",
              description: "SEO Services (Monthly)",
              quantity: 3,
              unitPrice: 1000,
              amount: 3000
            },
            {
              id: "3",
              description: "Content Creation",
              quantity: 10,
              unitPrice: 100,
              amount: 1000
            }
          ]}
          subtotal={9000}
          tax={0}
          total={9000}
          notes="Thank you for your business!"
        />
      </div>
    </div>
  );
}
