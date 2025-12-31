import type { ClientData } from '@/lib/client';
import { Star, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ClientCardProps {
  client: ClientData;
  onFavoriteToggle: (clientId: string, isFavorite: boolean) => void;
  onAction: (action: string, client: ClientData) => void;
}

export function ClientCard({ client, onFavoriteToggle, onAction }: ClientCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    prospect: 'bg-blue-100 text-blue-800',
    archived: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors">
      {/* Left Section */}
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-indigo-100 text-indigo-600">
            {client.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{client.name}</h3>
          <p className="text-sm text-gray-500 truncate">
            {client.company || client.email}
          </p>
        </div>
      </div>

      {/* Middle Section */}
      <div className="mx-4">
        <span 
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            statusColors[client.status] || 'bg-gray-100 text-gray-800'
          )}
        >
          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onFavoriteToggle(client.id, !client.isFavorite)}
          className={client.isFavorite ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-400 hover:text-gray-500'}
        >
          <Star className={`h-4 w-4 ${client.isFavorite ? 'fill-current' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onAction('menu', client)}
          className="text-gray-400 hover:text-gray-500"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
