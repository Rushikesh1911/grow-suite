import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InvoiceList } from "@/components/invoices/invoice-list";
import { Invoice } from "@/components/invoices/invoice";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');

  const invoices = [
    {
      id: "1",
      invoiceNumber: "INV-2023-001",
      client: "John Doe",
      amount: 9000,
      status: "pending" as const,
      issueDate: "2023-11-15",
      dueDate: "2023-12-15"
    },
    {
      id: "2",
      invoiceNumber: "INV-2023-002",
      client: "Acme Corp",
      amount: 12500,
      status: "paid" as const,
      issueDate: "2023-11-10",
      dueDate: "2023-12-10"
    },
    {
      id: "3",
      invoiceNumber: "INV-2023-003",
      client: "Tech Solutions",
      amount: 7500,
      status: "overdue" as const,
      issueDate: "2023-10-15",
      dueDate: "2023-11-15"
    }
  ];

  const handleInvoiceSelect = (id: string) => {
    setSelectedInvoice(id);
    setView('detail');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedInvoice(null);
  };

  const selectedInvoiceData = invoices.find(inv => inv.id === selectedInvoice);

  if (view === 'detail' && selectedInvoiceData) {
    return (
      <div className="container py-8">
        <Button 
          variant="ghost" 
          onClick={handleBackToList}
          className="mb-6"
        >
          ← Back to Invoices
        </Button>
        <Invoice
          invoiceNumber={selectedInvoiceData.invoiceNumber}
          issueDate={selectedInvoiceData.issueDate}
          dueDate={selectedInvoiceData.dueDate}
          status={selectedInvoiceData.status}
          from={{
            name: "Your Company",
            address: "123 Business St, San Francisco, CA 94103",
            email: "billing@yourcompany.com",
            phone: "(555) 123-4567"
          }}
          to={{
            name: selectedInvoiceData.client,
            email: "client@example.com",
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
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage and view your invoices</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <InvoiceList 
            invoices={invoices} 
            onSelect={handleInvoiceSelect}
          />
        </CardContent>
      </Card>
    </div>
  );
}
