import { X, ChevronRight, ChevronLeft, Mail, Phone, Building2, Globe, MapPin, User, Calendar, Clock, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { format } from 'date-fns';

interface ClientSecondaryPanelProps {
  client: any;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
}

export function ClientSecondaryPanel({ client, isOpen, onToggle, onEdit }: ClientSecondaryPanelProps) {
  if (!client) return null;

  return (
    <div
      className={`fixed right-0 top-16 h-[calc(100vh-4rem)] bg-black transition-all duration-300 ease-in-out z-10 shadow-2xl ${isOpen ? 'w-80' : 'w-0 overflow-hidden'
        }`}
      style={{
        boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="h-full flex flex-col text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Client Details</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Contact Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
            <div className="space-y-1.5">
              {client.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${client.email}`} className="text-sm hover:underline">
                    {client.email}
                  </a>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${client.phone}`} className="text-sm hover:underline">
                    {client.phone}
                  </a>
                </div>
              )}
              {client.company && (
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.company}</span>
                </div>
              )}
              {client.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {client.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {client.address && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{client.address}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Additional Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Additional Information</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={client.status === 'active' ? 'default' : 'outline'}>
                  {client.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source</span>
                <span>{client.source || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{client.createdAt ? format(new Date(client.createdAt), 'MMM d, yyyy') : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Contact</span>
                {client.lastContact ? (
                  <span>{format(new Date(client.lastContact), 'MMM d, yyyy')}</span>
                ) : (
                  <span className="text-muted-foreground text-sm">No contact yet</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          {client.tags?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {client.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}


          {/* Recent Interactions */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Recent Interactions</h4>
            {client.interactions?.length > 0 ? (
              <div className="space-y-3">
                {client.interactions.map((interaction: any) => (
                  <div key={interaction.id} className="p-3 rounded-lg bg-gray-900">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {interaction.type === 'email' && <Mail className="h-4 w-4 text-primary" />}
                          {interaction.type === 'call' && <Phone className="h-4 w-4 text-primary" />}
                          {interaction.type === 'meeting' && <Calendar className="h-4 w-4 text-primary" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{interaction.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{interaction.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(interaction.date), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed border-gray-700 rounded-lg">
                <p className="text-sm text-muted-foreground">No interactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClientSecondaryPanelToggle({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-20">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className="rounded-r-none border-r-0 h-10 w-6 bg-black text-white hover:bg-gray-900 hover:text-white"
        style={{
          boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.2)'
        }}
      >
        {isOpen ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
