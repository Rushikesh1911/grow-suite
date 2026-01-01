import type { ClientData } from '@/lib/client';
import { Star, MoreVertical, Mail, Phone, MessageSquare, Globe, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ClientCardProps {
  client: ClientData;
  onFavoriteToggle: (clientId: string, isFavorite: boolean) => void;
  onAction: (action: string, client: ClientData) => void;
  onClick?: (client: ClientData) => void;
}

export function ClientCard({ client, onFavoriteToggle, onAction, onClick }: ClientCardProps) {
  const statusConfig = {
    active: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      dot: 'bg-emerald-500'
    },
    inactive: {
      bg: 'bg-gray-50 dark:bg-gray-800/50',
      text: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-700',
      dot: 'bg-gray-400'
    },
    prospect: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      dot: 'bg-blue-500'
    },
    'on-hold': {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500'
    },
  };

  const status = statusConfig[client.status as keyof typeof statusConfig] || statusConfig.inactive;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  const getContactIcon = () => {
    const method = client.preferredContactMethod || 'email'; // Default to 'email' if undefined
    switch (method) {
      case 'whatsapp':
        return <MessageSquare className="h-3 w-3" />;
      case 'call':
        return <Phone className="h-3 w-3" />;
      default:
        return <Mail className="h-3 w-3" />;
    }
  };

  return (
    <Link to={`/clients/${client.id}`} className="block">
      <div
        className={cn(
          "group relative rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200",
          "hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5",
          "dark:border-gray-800 dark:bg-gray-900 dark:hover:shadow-gray-950/50",
          onClick && "cursor-pointer"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", status.bg)}>
              <span className={cn("font-medium", status.text)}>{getInitials(client.name)}</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{client.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                {getContactIcon()}
                <span className="ml-1">{client.email}</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAction('menu', client);
            }}
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center",
              "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
              "dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800"
            )}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium",
            status.text,
            status.bg,
            status.border
          )}>
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavoriteToggle(client.id, !client.isFavorite);
              }}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                "text-gray-400 hover:text-amber-400",
                client.isFavorite && "text-amber-400"
              )}
            >
              <Star className={cn("h-4 w-4", client.isFavorite && "fill-current")} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}