import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyClientsProps {
  onAddClient: () => void;
}

export function EmptyClients({ onAddClient }: EmptyClientsProps) {
  return (
    <div className="flex flex-col items-center justify-start pt-2 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="w-52 h-60 relative">
            <img 
              src="/empty-client.svg" 
              alt="No clients" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold text-foreground">No clients yet</h2>
          <p className="mt-2 text-muted-foreground">
            Get started by adding your first client to the system.
          </p>
          <div className="mt-6">
            <Button onClick={onAddClient} className="inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add your first client
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
