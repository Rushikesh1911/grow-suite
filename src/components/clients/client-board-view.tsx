import type { ClientData } from '@/lib/client';
import { cn } from '@/lib/utils';
import { ClientCard } from './client-card';

type StatusGroup = {
  id: string;
  label: string;
  color: string;
  clients: ClientData[];
};

interface ClientBoardViewProps {
  clients: ClientData[];
  onFavoriteToggle: (clientId: string, isFavorite: boolean) => void;
  onAction: (action: string, client: ClientData) => void;
}

export function ClientBoardView({ clients, onFavoriteToggle, onAction }: ClientBoardViewProps) {
  const statusGroups: StatusGroup[] = [
    {
      id: 'active',
      label: 'Active',
      color: 'bg-green-500',
      clients: clients.filter(c => c.status === 'active')
    },
    {
      id: 'inactive',
      label: 'Inactive',
      color: 'bg-gray-400',
      clients: clients.filter(c => c.status === 'inactive')
    },
    {
      id: 'prospect',
      label: 'Prospect',
      color: 'bg-blue-500',
      clients: clients.filter(c => c.status === 'prospect')
    },
    {
      id: 'archived',
      label: 'Archived',
      color: 'bg-yellow-500',
      clients: clients.filter(c => c.status === 'archived')
    }
  ];

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4 -mx-6 px-6">
      {statusGroups.map((group) => (
        <div key={group.id} className="flex-1 min-w-[300px] max-w-[350px]">
          <div className="flex items-center mb-4">
            <div className={cn('w-2 h-2 rounded-full mr-2', group.color)} />
            <h3 className="font-medium text-sm text-muted-foreground">
              {group.label} <span className="text-muted-foreground/60">({group.clients.length})</span>
            </h3>
          </div>
          <div className="space-y-3">
            {group.clients.map((client) => (
              <div 
                key={client.id} 
                className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow"
              >
                <ClientCard 
                  client={client} 
                  onFavoriteToggle={onFavoriteToggle}
                  onAction={onAction}
                />
              </div>
            ))}
            <button className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md border border-dashed hover:border-foreground/20 text-left">
              + Add client
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
