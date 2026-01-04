import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Mail, Printer } from "lucide-react";

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

type InvoiceProps = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  from: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  to: {
    name: string;
    email: string;
    address: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
};

export function Invoice({
  invoiceNumber,
  issueDate,
  dueDate,
  status,
  from,
  to,
  items,
  subtotal,
  tax,
  total,
  notes,
}: InvoiceProps) {
  const statusColors = {
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Note:</span> This is a sample UI. The team is working on the invoice page. We will inform you shortly!
            </p>
          </div>
        </div>
      </div>
      <Card className="w-full">
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">INVOICE</h1>
              <p className="text-muted-foreground">#{invoiceNumber}</p>
            </div>
            <Badge className={`px-3 py-1 text-sm ${statusColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">From</h3>
              <p className="font-medium">{from.name}</p>
              <p className="text-sm text-muted-foreground">{from.address}</p>
              <p className="text-sm text-muted-foreground">{from.email}</p>
              <p className="text-sm text-muted-foreground">{from.phone}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Bill To</h3>
                <p className="font-medium">{to.name}</p>
                <p className="text-sm text-muted-foreground">{to.email}</p>
                <p className="text-sm text-muted-foreground">{to.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                  <p>{issueDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                  <p>{dueDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-muted/50 p-4 text-sm font-medium">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-right">Quantity</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 p-4 border-t text-sm">
                <div className="col-span-6 font-medium">{item.description}</div>
                <div className="col-span-2 text-right">{item.quantity}</div>
                <div className="col-span-2 text-right">${item.unitPrice.toFixed(2)}</div>
                <div className="col-span-2 text-right font-medium">${item.amount.toFixed(2)}</div>
              </div>
            ))}

            <div className="border-t p-4">
              <div className="grid grid-cols-12 gap-4 max-w-md ml-auto">
                <div className="col-span-8 text-right text-sm">Subtotal</div>
                <div className="col-span-4 text-right">${subtotal.toFixed(2)}</div>

                <div className="col-span-8 text-right text-sm">Tax (0%)</div>
                <div className="col-span-4 text-right">${tax.toFixed(2)}</div>

                <div className="col-span-8 text-right font-bold">Total</div>
                <div className="col-span-4 text-right font-bold text-lg">${total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {notes && (
            <div className="mt-6 p-4 bg-muted/20 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
              <p className="text-sm">{notes}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 border-t p-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Mail className="h-4 w-4" />
            Send Email
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Example usage:
/*
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
*/
