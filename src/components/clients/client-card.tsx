import type { ClientData } from '@/lib/client';
import { Star, MoreVertical, Mail, Phone, MessageSquare, ChevronRight, User, Briefcase, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ClientCardProps {
  client: ClientData;
  onFavoriteToggle: (clientId: string, isFavorite: boolean) => void;
  onAction: (action: string, client: ClientData) => void;
  onClick?: (client: ClientData) => void;
}

export function ClientCard({ client, onFavoriteToggle, onAction, onClick }: ClientCardProps) {
  const statusConfig = {
    active: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      icon: '',
      label: 'Active'
    },
    inactive: {
      bg: 'bg-gray-500/10',
      text: 'text-gray-600 dark:text-gray-400',
      icon: '',
      label: 'Inactive'
    },
    prospect: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      icon: '',
      label: 'Prospect'
    },
    'on-hold': {
      bg: 'bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
      icon: '',
      label: 'On Hold'
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <Link 
        to={`/clients/${client.id}`} 
        className={cn(
          "block rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800",
          "transition-all duration-200 overflow-hidden",
          "hover:shadow-md hover:shadow-gray-100/50 dark:hover:shadow-gray-900/30",
          "hover:border-gray-200 dark:hover:border-gray-700"
        )}
      >
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback className={cn("font-medium text-sm", status.text, status.bg)}>
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {client.name}
                  <ChevronRight className="inline-block h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center">
                  {getContactIcon()}
                  <span className="ml-1.5 truncate max-w-[180px]">{client.email}</span>
                </p>
                
                <div className="mt-2 flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs font-normal px-2.5 py-0.5 rounded-full border-0",
                      status.bg,
                      status.text
                    )}
                  >
                    <span className="mr-1">{status.icon}</span>
                    {status.label}
                  </Badge>
                  {client.lastContacted && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>2d ago</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAction('menu', client);
              }}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center",
                "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
                "dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800",
                "transition-colors duration-150"
              )}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Briefcase className="h-4 w-4 mr-1.5 text-gray-400" />
                <span>{client.company || 'No company'}</span>
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavoriteToggle(client.id, !client.isFavorite);
              }}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center",
                "text-gray-400 hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20",
                client.isFavorite && "text-amber-400",
                "transition-colors duration-150"
              )}
              aria-label={client.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={cn("h-4 w-4", client.isFavorite && "fill-current")} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}