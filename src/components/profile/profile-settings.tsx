import { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Save, Globe, Briefcase, DollarSign, Clock, Github, Linkedin } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type ProfileData = {
  // Basic Info (from auth)
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
};

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSettings({ isOpen, onClose }: ProfileSettingsProps) {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'professional' | 'business' | 'availability'>('basic');
  
  const [profile, setProfile] = useState<ProfileData>({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    photoURL: currentUser?.photoURL || '',
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
    
    joinDate: currentUser?.metadata.creationTime || new Date().toISOString(),
  });

  const [skillInput, setSkillInput] = useState('');
  const [paymentInput, setPaymentInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (field: 'showPortfolioToClients' | 'taxIncludedInRate') => {
    setProfile(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && profile.secondarySkills.length < 10) {
      setProfile(prev => ({
        ...prev,
        secondarySkills: [...prev.secondarySkills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setProfile(prev => ({
      ...prev,
      secondarySkills: prev.secondarySkills.filter((_, i) => i !== index)
    }));
  };

  const addPaymentMethod = () => {
    if (paymentInput.trim() && profile.paymentMethods.length < 5) {
      setProfile(prev => ({
        ...prev,
        paymentMethods: [...prev.paymentMethods, paymentInput.trim()]
      }));
      setPaymentInput('');
    }
  };

  const removePaymentMethod = (index: number) => {
    setProfile(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log('Profile updated:', profile);
    setIsEditing(false);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'business', label: 'Business', icon: DollarSign },
    { id: 'availability', label: 'Availability', icon: Clock },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all dark:bg-gray-900">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                Profile Settings
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Profile Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-6 dark:border-gray-800 dark:bg-gray-800/50">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-gray-800">
                  <img
                    src={profile.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || 'U')}&background=4f46e5&color=fff`}
                    alt={profile.displayName || 'User'}
                    className="h-full w-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 rounded-full bg-primary-600 p-1.5 text-white shadow-md hover:bg-primary-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {profile.displayName || 'User'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {profile.email}
                </p>
                {profile.professionalTitle && (
                  <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {profile.professionalTitle}
                  </p>
                )}
                <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="mr-1 h-3.5 w-3.5" />
                  <span>Member since {new Date(profile.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center space-x-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="max-h-[60vh] overflow-y-auto p-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name *</Label>
                    <div className="flex h-10 items-center rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                      {profile.displayName}
                    </div>
                    <p className="text-xs text-gray-500">From your account (non-editable)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="flex h-10 items-center rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                      {profile.email}
                    </div>
                    <p className="text-xs text-gray-500">From your account (non-editable)</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalTitle">Professional Title</Label>
                  <Input
                    id="professionalTitle"
                    name="professionalTitle"
                    value={profile.professionalTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Frontend Developer, UI/UX Designer"
                    disabled={!isEditing}
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Short Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself in 2-3 lines..."
                    rows={3}
                    disabled={!isEditing}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>
            )}

            {/* Contact Info Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      disabled={!isEditing}
                      className="disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp (Optional)</Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      value={profile.whatsapp}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      disabled={!isEditing}
                      className="disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="location"
                        name="location"
                        value={profile.location}
                        onChange={handleInputChange}
                        className="pl-10 disabled:cursor-not-allowed disabled:opacity-60"
                        placeholder="City, Country"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={profile.timezone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="UTC">UTC</option>
                      <option value="Asia/Kolkata">India (IST)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                  <select
                    id="preferredContactMethod"
                    name="preferredContactMethod"
                    value={profile.preferredContactMethod}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="chattrix">ChatTrix</option>
                    <option value="others">Other</option>
                  </select>
                  <p className="text-xs text-gray-500">How clients should reach you</p>
                </div>
              </div>
            )}

            {/* Professional Info Tab */}
            {activeTab === 'professional' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primarySkill">Primary Skill / Role</Label>
                    <Input
                      id="primarySkill"
                      name="primarySkill"
                      value={profile.primarySkill}
                      onChange={handleInputChange}
                      placeholder="e.g. React Developer"
                      disabled={!isEditing}
                      className="disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Input
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="number"
                      value={profile.yearsOfExperience}
                      onChange={handleInputChange}
                      placeholder="5"
                      disabled={!isEditing}
                      className="disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Secondary Skills</Label>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill} size="sm">Add</Button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.secondarySkills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-600 hover:bg-primary-200 hover:text-primary-800 dark:text-primary-400"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolioWebsite">Portfolio Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="portfolioWebsite"
                      name="portfolioWebsite"
                      type="url"
                      value={profile.portfolioWebsite}
                      onChange={handleInputChange}
                      className="pl-10 disabled:cursor-not-allowed disabled:opacity-60"
                      placeholder="https://yourportfolio.com"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="flex-1">
                    <Label htmlFor="showPortfolioToClients" className="cursor-pointer font-medium">
                      Show portfolio to clients
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Make your portfolio visible on your public profile
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => isEditing && handleToggle('showPortfolioToClients')}
                    disabled={!isEditing}
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
                      profile.showPortfolioToClients ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        profile.showPortfolioToClients ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                <div className="space-y-4">
                  <Label>Social Links (Optional)</Label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        name="githubUrl"
                        type="url"
                        value={profile.githubUrl}
                        onChange={handleInputChange}
                        className="pl-10 disabled:cursor-not-allowed disabled:opacity-60"
                        placeholder="https://github.com/username"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        name="linkedinUrl"
                        type="url"
                        value={profile.linkedinUrl}
                        onChange={handleInputChange}
                        className="pl-10 disabled:cursor-not-allowed disabled:opacity-60"
                        placeholder="https://linkedin.com/in/username"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        name="behanceUrl"
                        type="url"
                        value={profile.behanceUrl}
                        onChange={handleInputChange}
                        className="pl-10 disabled:cursor-not-allowed disabled:opacity-60"
                        placeholder="https://behance.net/username"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Business & Payments Tab */}
            {activeTab === 'business' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Default Hourly Rate</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        value={profile.hourlyRate}
                        onChange={handleInputChange}
                        className="pl-10 disabled:cursor-not-allowed disabled:opacity-60"
                        placeholder="50"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Preferred Currency</Label>
                    <select
                      id="currency"
                      name="currency"
                      value={profile.currency}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="flex-1">
                    <Label htmlFor="taxIncludedInRate" className="cursor-pointer font-medium">
                      Tax included in rate?
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Specify if your rates include tax (GST/VAT)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => isEditing && handleToggle('taxIncludedInRate')}
                    disabled={!isEditing}
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
                      profile.taxIncludedInRate ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        profile.taxIncludedInRate ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {/* TODO: Future Enhancement - Multiple Rate Types
                    Add support for:
                    - Hourly Rate
                    - Fixed Project Rate
                    - Retainer/Monthly Rate
                    Each with their own tax settings
                */}

                <div className="space-y-2">
                  <Label>Payment Methods</Label>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Input
                        value={paymentInput}
                        onChange={(e) => setPaymentInput(e.target.value)}
                        placeholder="e.g. UPI, PayPal, Stripe..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPaymentMethod())}
                      />
                      <Button type="button" onClick={addPaymentMethod} size="sm">Add</Button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.paymentMethods.map((method, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        {method}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removePaymentMethod(index)}
                            className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-green-600 hover:bg-green-200 hover:text-green-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Invoice / Business Name</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={profile.businessName}
                      onChange={handleInputChange}
                      placeholder="Your Business Name"
                      disabled={!isEditing}
                      className="disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxInfo">Tax Info (GST/VAT - Optional)</Label>
                    <Input
                      id="taxInfo"
                      name="taxInfo"
                      value={profile.taxInfo}
                      onChange={handleInputChange}
                      placeholder="GST/VAT Number"
                      disabled={!isEditing}
                      className="disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="availabilityStatus">Availability Status</Label>
                  <select
                    id="availabilityStatus"
                    name="availabilityStatus"
                    value={profile.availabilityStatus}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                  </select>
                  <p className="text-xs text-gray-500">This will be visible to clients</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Working Hours</Label>
                    <Input
                      id="workingHours"
                      name="workingHours"
                      value={profile.workingHours}
                      onChange={handleInputChange}
                      placeholder="9 AM - 5 PM"
                      disabled={!isEditing}
                      className="disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxActiveProjects">Max Active Projects</Label>
                    <Input
                      id="maxActiveProjects"
                      name="maxActiveProjects"
                      type="number"
                      value={profile.maxActiveProjects}
                      onChange={handleInputChange}
                      placeholder="3"
                      disabled={!isEditing}
                      className="disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectPreference">Project Preference</Label>
                  <select
                    id="projectPreference"
                    name="projectPreference"
                    value={profile.projectPreference}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="fixed">Fixed Price Projects</option>
                    <option value="hourly">Hourly Projects</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
            )}
          </form>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
            <div className="flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={handleSubmit}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
