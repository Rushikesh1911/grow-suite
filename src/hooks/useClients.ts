
import { useState, useEffect, useCallback } from 'react';
import { clientService } from '@/lib/client';
import type { ClientData, ClientStatus } from '@/lib/client';
import { useAuth } from '@/contexts/auth-context';

export function useClients() {
  const { currentUser } = useAuth();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentClient, setCurrentClient] = useState<ClientData | null>(null);

  // Load all clients for the current user
  const loadClients = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userClients = await clientService.getUserClients(currentUser.uid);
      setClients(userClients);
      setError(null);
    } catch (err) {
      console.error('Failed to load clients:', err);
      setError('Failed to load clients. Please try again.');
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load a single client by ID
  const loadClient = useCallback(async (clientId: string) => {
    try {
      setLoading(true);
      const client = await clientService.getClient(clientId);
      setCurrentClient(client);
      setError(null);
      return client;
    } catch (err) {
      console.error('Failed to load client:', err);
      setError('Failed to load client. Please try again.');
      setCurrentClient(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new client
  const createClient = async (clientData: Omit<ClientData, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      const clientId = await clientService.createClient(clientData, currentUser.uid);
      await loadClients(); // Refresh the clients list
      return clientId;
    } catch (err) {
      console.error('Failed to create client:', err);
      throw new Error('Failed to create client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update an existing client
  const updateClient = async (clientId: string, updates: Partial<ClientData>) => {
    try {
      setLoading(true);
      await clientService.updateClient(clientId, updates);
      
      // Update the local state
      setClients(prevClients =>
        prevClients.map(client =>
          client.id === clientId ? { ...client, ...updates, updatedAt: new Date() } : client
        )
      );
      
      if (currentClient?.id === clientId) {
        setCurrentClient(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
      }
      
      return true;
    } catch (err) {
      console.error('Failed to update client:', err);
      throw new Error('Failed to update client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a client
  const deleteClient = async (clientId: string) => {
    try {
      setLoading(true);
      await clientService.deleteClient(clientId);
      
      // Update the local state
      setClients(prevClients => prevClients.filter(client => client.id !== clientId));
      
      if (currentClient?.id === clientId) {
        setCurrentClient(null);
      }
      
      return true;
    } catch (err) {
      console.error('Failed to delete client:', err);
      throw new Error('Failed to delete client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (clientId: string, isFavorite: boolean) => {
    try {
      await clientService.toggleFavorite(clientId, isFavorite);
      
      // Update the local state
      setClients(prevClients =>
        prevClients.map(client =>
          client.id === clientId ? { ...client, isFavorite, updatedAt: new Date() } : client
        )
      );
      
      if (currentClient?.id === clientId) {
        setCurrentClient(prev => prev ? { ...prev, isFavorite, updatedAt: new Date() } : null);
      }
      
      return true;
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      throw new Error('Failed to update favorite status. Please try again.');
    }
  };

  // Filter clients by status
  const getClientsByStatus = (status: ClientStatus) => {
    return clients.filter(client => client.status === status);
  };

  // Get favorite clients
  const getFavoriteClients = () => {
    return clients.filter(client => client.isFavorite);
  };

  // Load clients on component mount and when currentUser changes
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  return {
    clients,
    currentClient,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    loadClient,
    loadClients,
    toggleFavorite,
    getClientsByStatus,
    getFavoriteClients,
  };
}
