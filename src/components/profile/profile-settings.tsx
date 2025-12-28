import { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Save,
  Globe,
  Briefcase,
  DollarSign,
  Clock,
  Github,
  Linkedin,
} from 'lucide-react';

import { useAuth } from '@/contexts/auth-context';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSettings({ isOpen, onClose }: ProfileSettingsProps) {
  const { currentUser } = useAuth();
  const { profile, loading, updateProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] =
    useState<'basic' | 'contact' | 'professional' | 'business' | 'availability'>('basic');

  const [localProfile, setLocalProfile] = useState(profile);

  const [skillInput, setSkillInput] = useState('');
  const [paymentInput, setPaymentInput] = useState('');

  const countryCodes = [
    { code: '91', name: 'India (+91)', flag: '🇮🇳' },
    { code: '1', name: 'USA/Canada (+1)', flag: '🇺🇸' },
    { code: '44', name: 'UK (+44)', flag: '🇬🇧' },
    { code: '61', name: 'Australia (+61)', flag: '🇦🇺' },
    { code: '65', name: 'Singapore (+65)', flag: '🇸🇬' },
    { code: '971', name: 'UAE (+971)', flag: '🇦🇪' },
    { code: '81', name: 'Japan (+81)', flag: '🇯🇵' },
    { code: '82', name: 'South Korea (+82)', flag: '🇰🇷' },
  ];

  /* -------------------- SYNC FIRESTORE → LOCAL -------------------- */
  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
    }
  }, [profile]);

  if (!isOpen || loading || !localProfile || !currentUser) return null;

  /* -------------------- HANDLERS -------------------- */

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalProfile(prev => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'phone' | 'whatsapp') => {
    const { value } = e.target;
    // Remove all non-digit characters
    const numbersOnly = value.replace(/\D/g, '');

    setLocalProfile(prev => ({
      ...prev!,
      [type === 'phone' ? 'phoneNumber' : 'whatsappNumber']: numbersOnly,
    }));
  };

  const handleCountryCodeChange = (value: string, type: 'phone' | 'whatsapp') => {
    setLocalProfile(prev => ({
      ...prev!,
      [type === 'phone' ? 'phoneCountryCode' : 'whatsappCountryCode']: value,
    }));
  };

  const handleToggle = (field: 'showPortfolioToClients' | 'taxIncludedInRate') => {
    setLocalProfile(prev => ({
      ...prev!,
      [field]: !prev![field],
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && localProfile.secondarySkills.length < 10) {
      setLocalProfile(prev => ({
        ...prev!,
        secondarySkills: [...prev!.secondarySkills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setLocalProfile(prev => ({
      ...prev!,
      secondarySkills: prev!.secondarySkills.filter((_, i) => i !== index),
    }));
  };

  const addPaymentMethod = () => {
    if (paymentInput.trim() && localProfile.paymentMethods.length < 5) {
      setLocalProfile(prev => ({
        ...prev!,
        paymentMethods: [...prev!.paymentMethods, paymentInput.trim()],
      }));
      setPaymentInput('');
    }
  };

  const removePaymentMethod = (index: number) => {
    setLocalProfile(prev => ({
      ...prev!,
      paymentMethods: prev!.paymentMethods.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(localProfile);
    if (success) setIsEditing(false);
  };

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
        />

        <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-gray-900 flex flex-col">

          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-white/80 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Profile Header */}
          <div className="border-b bg-gray-50 px-6 py-6 dark:bg-gray-800/50">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-lg">
                <img
                  src={
                    localProfile.photoURL?.trim()
                      ? localProfile.photoURL
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        localProfile.displayName || 'U'
                      )}`
                  }
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold">{localProfile.displayName}</h2>
                <p className="text-sm text-gray-600">{localProfile.email}</p>
                {localProfile.professionalTitle && (
                  <p className="text-sm font-medium text-primary-600">
                    {localProfile.professionalTitle}
                  </p>
                )}
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <Calendar className="mr-1 h-3.5 w-3.5" />
                  Member since{' '}
                  {new Date(localProfile.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b px-6">
            <nav className="flex space-x-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center space-x-2 border-b-2 py-4 text-sm',
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500'
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
          <form
            onSubmit={handleSubmit}
            className="max-h-[60vh] overflow-y-auto p-6 bg-white dark:bg-gray-900"
          >
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
                    value={localProfile.professionalTitle}
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
                    value={localProfile.bio}
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
                    <div className="flex space-x-2">
                      <select
                        value={localProfile.phoneCountryCode || '91'}
                        onChange={(e) => handleCountryCodeChange(e.target.value, 'phone')}
                        disabled={!isEditing}
                        className="w-24 rounded-md border border-input bg-background px-2 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} +{country.code}
                          </option>
                        ))}
                      </select>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={localProfile.phoneNumber || ''}
                        onChange={(e) => handlePhoneNumberChange(e, 'phone')}
                        placeholder="9876543210"
                        disabled={!isEditing}
                        className="flex-1 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp (Optional)</Label>
                    <div className="flex space-x-2">
                      <select
                        value={localProfile.whatsappCountryCode || '91'}
                        onChange={(e) => handleCountryCodeChange(e.target.value, 'whatsapp')}
                        disabled={!isEditing}
                        className="w-24 rounded-md border border-input bg-background px-2 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {countryCodes.map((country) => (
                          <option key={`whatsapp-${country.code}`} value={country.code}>
                            {country.flag} +{country.code}
                          </option>
                        ))}
                      </select>
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        value={localProfile.whatsappNumber || ''}
                        onChange={(e) => handlePhoneNumberChange(e, 'whatsapp')}
                        placeholder="9876543210"
                        disabled={!isEditing}
                        className="flex-1 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
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
                        value={localProfile.location}
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
                      value={localProfile.timezone}
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
                    value={localProfile.preferredContactMethod}
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
                      value={localProfile.primarySkill}
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
                      value={localProfile.yearsOfExperience}
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
                    {localProfile.secondarySkills.map((skill, index) => (
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
                      value={localProfile.portfolioWebsite}
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
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => isEditing && handleToggle('showPortfolioToClients')}
                      disabled={!isEditing}
                      className={cn(
                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
                        localProfile.showPortfolioToClients ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          localProfile.showPortfolioToClients ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Social Links (Optional)</Label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        name="githubUrl"
                        type="url"
                        value={localProfile.githubUrl}
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
                        value={localProfile.linkedinUrl}
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
                        value={localProfile.behanceUrl}
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
                        value={localProfile.hourlyRate}
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
                      value={localProfile.currency}
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
                      localProfile.taxIncludedInRate ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        localProfile.taxIncludedInRate ? "translate-x-5" : "translate-x-0"
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
                    {localProfile.paymentMethods.map((method, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 dark:border-gray-700"
                      >
                        <span className="text-sm">{method}</span>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removePaymentMethod(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Invoice / Business Name</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={localProfile.businessName}
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
                      value={localProfile.taxInfo}
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
                    value={localProfile.availabilityStatus}
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
                      value={localProfile.workingHours}
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
                      value={localProfile.maxActiveProjects}
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
                    value={localProfile.projectPreference}
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

          {/* Footer */}
          <div className="border-t bg-white/5 dark:bg-gray-800 px-6 py-4">
            <div className="flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={handleSubmit}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
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