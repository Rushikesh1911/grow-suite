import { useState, useCallback } from 'react';
import { ClientsHeader } from '@/components/clients/clients-header';
import { EmptyClients } from '@/components/clients/empty-clients';
import { CreateClientModal } from '@/components/clients/create-client-modal';
import { ClientCard } from '@/components/clients/client-card';
import { useClients } from '@/hooks/useClients';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { clientService } from '@/lib/client';

const ClientsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const { clients, loading, error, loadClients, toggleFavorite } = useClients();
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null);
  const { toast } = useToast();

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
    switch (action) {
      case 'view':
        // Navigate to client details page
        // router.push(`/clients/${client.id}`);
        break;
      case 'edit':
        // Handle edit action
        // setEditingClient(client);
        // setIsEditModalOpen(true);
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
    setIsMenuOpen(null);
  };

  // Filter clients based on search query and favorites
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = !showFavorites || client.isFavorite;
    return matchesSearch && matchesFavorites;
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
          onToggleFavorites={handleToggleFavorites}
          showFavorites={showFavorites}
        />
      </div>

      <div className="mt-6">
        {filteredClients.length === 0 ? (
          <EmptyClients onAddClient={() => setIsCreateModalOpen(true)} />
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {filteredClients.map((client) => (
              <div key={client.id} className="relative">
                <ClientCard
                  client={client}
                  onFavoriteToggle={handleFavoriteToggle}
                  onAction={handleClientAction}
                />
                {isMenuOpen === client.id && (
                  <div className="absolute right-2 top-12 z-10 w-48 rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <DropdownMenuItem
                        onClick={() => handleClientAction('view', client)}
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleClientAction('edit', client)}
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleClientAction('delete', client)}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                      >
                        Delete
                      </DropdownMenuItem>
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
