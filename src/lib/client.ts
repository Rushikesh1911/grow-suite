import { db } from '@/config/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export type ClientStatus = 'active' | 'inactive' | 'prospect' | 'archived';

export interface ClientAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}

export interface ClientContact {
  name: string;
  email: string;
  phone: string;
  position: string;
  isPrimary: boolean;
}

export interface ClientData {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  status: ClientStatus;
  preferredContactMethod?: 'email' | 'whatsapp' | 'call';
  address?: ClientAddress | null;
  contacts?: ClientContact[] | null;
  notes?: string | null;
  tags?: string[] | null;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

const CLIENTS_COLLECTION = 'clients';

/**
 * Create a new client in Firestore
 */
export const createClient = async (clientData: Omit<ClientData, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<string> => {
  try {
    const clientId = uuidv4();
    const now = new Date();
    
    // Create a clean data object without undefined values
    const clientToSave: Omit<ClientData, 'id'> = {
      ...clientData,
      id: clientId,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      // Ensure all required fields have values
      name: clientData.name || 'Unnamed Client',
      email: clientData.email || '',
      status: clientData.status || 'prospect',
      isFavorite: clientData.isFavorite || false,
      // Remove undefined values from optional fields
      ...(clientData.company && { company: clientData.company }),
      ...(clientData.phone && { phone: clientData.phone }),
      ...(clientData.notes && { notes: clientData.notes }),
      ...(clientData.tags && { tags: clientData.tags.filter(Boolean) }), // Remove any empty tags
    };
    await setDoc(doc(db, CLIENTS_COLLECTION, clientId), clientToSave);
    return clientId;
  } catch (error) {
    console.error('Error creating client:', error);
    throw new Error('Failed to create client');
  }
};

/**
 * Update an existing client in Firestore
 */
export const updateClient = async (clientId: string, updates: Partial<Omit<ClientData, 'id' | 'createdAt' | 'createdBy'>>): Promise<void> => {
  try {
    const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
    
    await updateDoc(clientRef, {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error('Error updating client:', error);
    throw new Error('Failed to update client');
  }
};

/**
 * Get a single client by ID
 */
export const getClient = async (clientId: string): Promise<ClientData | null> => {
  try {
    const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
    const clientSnap = await getDoc(clientRef);
    
    if (!clientSnap.exists()) {
      return null;
    }
    
    const clientData = clientSnap.data() as Omit<ClientData, 'id'>;
    return {
      id: clientSnap.id,
      ...clientData,
      createdAt: (clientData.createdAt as any)?.toDate() || new Date(),
      updatedAt: (clientData.updatedAt as any)?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Error getting client:', error);
    throw new Error('Failed to get client');
  }
};

/**
 * Get all clients for a specific user
 */
export const getUserClients = async (userId: string): Promise<ClientData[]> => {
  try {
    const clientsQuery = query(
      collection(db, CLIENTS_COLLECTION),
      where('createdBy', '==', userId)
    );
    
    const querySnapshot = await getDocs(clientsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Omit<ClientData, 'id'>;
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as any)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as any)?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error getting user clients:', error);
    throw new Error('Failed to get user clients');
  }
};

/**
 * Delete a client by ID
 */
export const deleteClient = async (clientId: string): Promise<void> => {
  try {
    const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
    await deleteDoc(clientRef);
  } catch (error) {
    console.error('Error deleting client:', error);
    throw new Error('Failed to delete client');
  }
};

/**
 * Toggle favorite status for a client
 */
export const toggleFavorite = async (clientId: string, isFavorite: boolean): Promise<void> => {
  try {
    const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
    await updateDoc(clientRef, {
      isFavorite,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw new Error('Failed to update favorite status');
  }
};

export const clientService = {
  createClient,
  updateClient,
  getClient,
  getUserClients,
  deleteClient,
  toggleFavorite,
};
