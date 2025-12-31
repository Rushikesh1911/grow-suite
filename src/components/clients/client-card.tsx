import type { ClientData } from '@/lib/client';
import { Star, MoreVertical, Mail, Phone, MessageSquare, Globe, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
    <div
      className={cn(
        "group relative rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200",
        "hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5",
        "dark:border-gray-800 dark:bg-gray-900 dark:hover:shadow-gray-950/50",
        onClick && "cursor-pointer"
      )}
      onClick={() => onClick?.(client)}
    >
      {/* Favorite Star - Top Right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle(client.id, !client.isFavorite);
        }}
        className={cn(
          "absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-200",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          client.isFavorite
            ? "text-amber-500 hover:text-amber-600"
            : "text-gray-300 hover:text-gray-400 dark:text-gray-600"
        )}
      >
        <Star className={cn("h-4 w-4", client.isFavorite && "fill-current")} />
      </button>

      {/* Main Content */}
      <div className="flex items-start space-x-4 pr-8">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm dark:border-gray-800">
            <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold text-sm">
              {getInitials(client.name)}
            </AvatarFallback>
          </Avatar>
          {client.clientType === 'company' && (
            <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 shadow-sm dark:bg-gray-900">
              <div className="rounded-full bg-gray-100 p-1 dark:bg-gray-800">
                <Globe className="h-2.5 w-2.5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Client Info */}
        <div className="flex-1 min-w-0">
          {/* Name & Company */}
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate text-base mb-0.5">
              {client.name}
            </h3>
            {client.company && (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1.5">
                <Globe className="h-3 w-3 flex-shrink-0" />
                {client.company}
              </p>
            )}
          </div>

          {/* Status & Contact Method */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border",
                status.bg,
                status.text,
                status.border
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
              {client.status === 'on-hold' ? 'On Hold' : client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700">
              {getContactIcon()}
              {(client.preferredContactMethod || 'email').charAt(0).toUpperCase() + (client.preferredContactMethod || 'email').slice(1)}
            </span>

            {client.tags && client.tags.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700">
                <TrendingUp className="h-3 w-3" />
                {client.tags[0]}
              </span>
            )}
          </div>

       
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {/* {client.email && (
              <span className="inline-flex items-center gap-1.5 truncate max-w-[200px]">
                <Mail className="h-3 w-3 flex-shrink-0" />
                {client.email}
              </span>
            )} */}

            {client.defaultHourlyRate && (
              <span className="inline-flex items-center gap-1 flex-shrink-0">
                <DollarSign className="h-3 w-3" />
                {client.defaultCurrency} {client.defaultHourlyRate}/hr
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions Menu - Bottom Right */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onAction('menu', client);
        }}
        className={cn(
          "absolute bottom-4 right-4 h-8 w-8 opacity-0 transition-opacity duration-200",
          "group-hover:opacity-100",
          "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
          "dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800"
        )}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  );
}