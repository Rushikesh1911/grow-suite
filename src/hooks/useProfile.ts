import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/auth-context';

export type ProfileData = {
  // Basic Info
  displayName: string;
  email: string;
  photoURL: string;
  professionalTitle: string;
  bio: string;
  
  // Contact Info
  phone: string;
  whatsapp: string;
  location: string;
  timezone: string;
  preferredContactMethod: 'email' | 'whatsapp' | 'both';
  
  // Professional Info
  primarySkill: string;
  secondarySkills: string[];
  yearsOfExperience: string;
  portfolioWebsite: string;
  showPortfolioToClients: boolean;
  githubUrl: string;
  linkedinUrl: string;
  behanceUrl: string;
  
  // Business & Payments
  hourlyRate: string;
  currency: string;
  taxIncludedInRate: boolean;
  paymentMethods: string[];
  businessName: string;
  taxInfo: string;
  
  // Availability
  availabilityStatus: 'available' | 'busy';
  workingHours: string;
  maxActiveProjects: string;
  projectPreference: 'fixed' | 'hourly' | 'both';
  
  joinDate: string;
  updatedAt?: string;
};

export const defaultProfileData: Omit<ProfileData, 'displayName' | 'email' | 'photoURL' | 'joinDate'> = {
  professionalTitle: '',
  bio: '',
  phone: '',
  whatsapp: '',
  location: '',
  timezone: 'UTC',
  preferredContactMethod: 'email',
  primarySkill: '',
  secondarySkills: [],
  yearsOfExperience: '',
  portfolioWebsite: '',
  showPortfolioToClients: true,
  githubUrl: '',
  linkedinUrl: '',
  behanceUrl: '',
  hourlyRate: '',
  currency: 'USD',
  taxIncludedInRate: false,
  paymentMethods: [],
  businessName: '',
  taxInfo: '',
  availabilityStatus: 'available',
  workingHours: '9 AM - 5 PM',
  maxActiveProjects: '3',
  projectPreference: 'both',
};

export function useProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile data
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const profileRef = doc(db, 'profiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as ProfileData);
        } else {
          // Create new profile with default values
          const newProfile: ProfileData = {
            ...defaultProfileData,
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            joinDate: currentUser.metadata?.creationTime || new Date().toISOString(),
          };
          
          await setDoc(profileRef, newProfile);
          setProfile(newProfile);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  // Update profile data
  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      const profileRef = doc(db, 'profiles', currentUser.uid);
      const updatedAt = new Date().toISOString();
      
      await updateDoc(profileRef, {
        ...updates,
        updatedAt,
      });

      setProfile(prev => ({
        ...prev!,
        ...updates,
        updatedAt,
      }));

      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
  };
}
