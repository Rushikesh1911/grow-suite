import { useState,  useEffect } from 'react';
import { ClientsHeader } from '@/components/clients/clients-header';
import { EmptyClients } from '@/components/clients/empty-clients';
import { CreateClientModal } from '@/components/clients/create-client-modal';
import { ClientCard } from '@/components/clients/client-card';
import { ClientBoardView } from '@/components/clients/client-board-view';
import { DisplayToggle } from '@/components/ui/display-toggle';
import { useClients } from '@/hooks/useClients';
import { useToast } from '@/components/ui/use-toast';
import { clientService } from '@/lib/client';

type DisplayType = 'list' | 'board';

const ClientsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [displayType, setDisplayType] = useState<DisplayType>('list');
  const { clients, loading, error, loadClients, toggleFavorite } = useClients();
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null);
  const { toast } = useToast();

  // Set default view based on number of clients
  const getDefaultViewType = (clients: any[]): DisplayType => {
    return clients.length > 5 ? 'board' : 'list';
  };

  // Update display type when clients change
  useEffect(() => {
    if (clients.length > 0) {
      setDisplayType(getDefaultViewType(clients));
    }
  }, [clients.length]);

  const handleCreateClient = async (clientData: any) => {
    try {
      // The actual creation is handled by the useClients hook
      setIsCreateModalOpen(false);
      await loadClients(); // Refresh the client list
      toast({
        title: 'Success',
        description: 'Client created successfully',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: 'Error',
        description: 'Failed to create client',
        variant: 'error'
      });
    }
  };

  const handleFilterChange = (filter: string) => {
    setSearchQuery(filter);
    // Filtering is handled in the filteredClients computation
  };

  const handleToggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const handleFavoriteToggle = async (clientId: string, isFavorite: boolean) => {
    try {
      await toggleFavorite(clientId, isFavorite);
      toast({
        title: isFavorite ? 'Added to favorites' : 'Removed from favorites',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorite status',
        variant: 'error'
      });
    }
  };

  const handleClientAction = async (action: string, client: any) => {
    if (action === 'menu') {
      // Toggle menu for the clicked client
      setIsMenuOpen(prev => prev === client.id ? null : client.id);
      return;
    }

    // Close any open menu
    setIsMenuOpen(null);

    switch (action) {
      case 'view':
        // Navigate to client details page
        // router.push(`/clients/${client.id}`);
        toast({
          title: 'View Client',
          description: `Viewing details for ${client.name}`,
          variant: 'default'
        });
        break;
      case 'edit':
        // Handle edit action
        // setEditingClient(client);
        // setIsEditModalOpen(true);
        toast({
          title: 'Edit Client',
          description: `Editing ${client.name}`,
          variant: 'default'
        });
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
          try {
            await clientService.deleteClient(client.id);
            await loadClients();
            toast({
              title: 'Success',
              description: 'Client deleted successfully',
              variant: 'success'
            });
          } catch (error) {
            console.error('Error deleting client:', error);
            toast({
              title: 'Error',
              description: 'Failed to delete client',
              variant: 'error'
            });
          }
        }
        break;
      default:
        break;
    }
  };

  // Filter clients based on search query, status, and favorites
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesFavorites = !showFavorites || client.isFavorite;
    return matchesSearch && matchesStatus && matchesFavorites;
  });

  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error loading clients: {error}</p>
        <button 
          onClick={loadClients}
          className="mt-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      <div className="sticky top-0 bg-background z-10 -mx-6 px-6 pt-2 pb-1 border-b border-gray-100 dark:border-gray-800">
        <ClientsHeader
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onFilterChange={handleFilterChange}
          onStatusChange={setStatusFilter}
          onToggleFavorites={handleToggleFavorites}
          showFavorites={showFavorites}
          currentStatus={statusFilter}
        />
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'}
          </h2>
          <DisplayToggle 
            displayType={displayType}
            onDisplayTypeChange={setDisplayType}
          />
        </div>

        {filteredClients.length === 0 ? (
          <EmptyClients onAddClient={() => setIsCreateModalOpen(true)} />
        ) : displayType === 'board' ? (
          <ClientBoardView
            clients={filteredClients}
            onFavoriteToggle={handleFavoriteToggle}
            onAction={handleClientAction}
          />
        ) : (
          <div className="bg-card rounded-lg border overflow-hidden">
            {filteredClients.map((client) => (
              <div key={client.id} className="relative border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                <ClientCard
                  client={client}
                  onFavoriteToggle={handleFavoriteToggle}
                  onAction={handleClientAction}
                />
                {isMenuOpen === client.id && (
                  <div className="absolute right-2 bottom-14 z-50 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-white/10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClientAction('view', client);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClientAction('edit', client);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        Edit Client
                      </button>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClientAction('delete', client);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        role="menuitem"
                      >
                        Delete Client
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateClient}
      />
    </div>
  );
};

export default ClientsPage;
