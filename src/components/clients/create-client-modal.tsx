import { useState, useEffect } from 'react';
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  DollarSign,
  AlertCircle,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (clientData: ClientData) => void;
}

type ClientType = 'individual' | 'company';
type ContactMethod = 'email' | 'whatsapp' | 'call';
type ClientStatus = 'active' | 'prospect' | 'on-hold';

type ClientData = {
  // Basic Identity
  clientName: string;
  companyName: string;
  clientType: ClientType;

  // Contact Info
  email: string;
  phone: string;
  preferredContactMethod: ContactMethod;

  // Business Context
  industry: string;
  country: string;
  timezone: string;

  // Financial Defaults
  defaultCurrency: string;
  defaultHourlyRate: string;
  taxApplicable: boolean;

  // Status & Notes
  clientStatus: ClientStatus;
  internalNotes: string;
};

const INDUSTRIES = [
  'IT & Software',
  'E-commerce',
  'Agency',
  'Startup',
  'Healthcare',
  'Education',
  'Finance',
  'Real Estate',
  'Marketing',
  'Manufacturing',
  'Retail',
  'Hospitality',
  'Non-Profit',
  'Legal',
  'Consulting',
  'Other'
];

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'India',
  'Singapore',
  'UAE',
  'Netherlands',
  'Spain',
  'Italy',
  'Brazil',
  'Mexico',
  'Other'
];

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

const STATUS_OPTIONS = [
  { value: 'prospect', label: 'Prospect', hint: 'Yet to start working with this client' },
  { value: 'active', label: 'Active', hint: 'Currently working with this client' },
  { value: 'inactive', label: 'Inactive', hint: 'Not currently active but may return' },
  { value: 'on-hold', label: 'On Hold', hint: 'Paused or waiting for next steps' },
  { value: 'closed', label: 'Closed', hint: 'Project/relationship completed' },
];

export function CreateClientModal({ isOpen, onClose, onSave }: CreateClientModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientData, string>>>({});

  const [formData, setFormData] = useState<ClientData>({
    clientName: '',
    companyName: '',
    clientType: 'individual',
    email: '',
    phone: '',
    preferredContactMethod: 'email',
    industry: '',
    country: '',
    timezone: 'America/New_York',
    defaultCurrency: 'USD',
    defaultHourlyRate: '',
    taxApplicable: false,
    clientStatus: 'prospect',
    internalNotes: ''
  });

  const handleInputChange = (field: keyof ClientData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ClientData, string>> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Client data:', formData);
      if (onSave) {
        onSave(formData);
      }
      setIsSaving(false);
      handleClose();
    }, 1000);
  };

  const handleClose = () => {
    setFormData({
      clientName: '',
      companyName: '',
      clientType: 'individual',
      email: '',
      phone: '',
      preferredContactMethod: 'email',
      industry: '',
      country: '',
      timezone: 'America/New_York',
      defaultCurrency: 'USD',
      defaultHourlyRate: '',
      taxApplicable: false,
      clientStatus: 'prospect',
      internalNotes: ''
    });
    setErrors({});
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div
        id="backdrop"
        className="fixed inset-0 z-[90] bg-black/50 transition-opacity"
        onClick={(e) => {
          if ((e.target as HTMLElement).id === 'backdrop') {
            handleClose();
          }
        }}
      />

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-end p-4">
        <div className="relative z-[100] w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all dark:bg-gray-900 max-h-[90vh] flex flex-col mr-4">

          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Create New Client
                  </h2>
                  <p className="text-sm text-white/80">
                    Add a new client to your CRM
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-8">

              {/* 1. Basic Identity */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <Building2 className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Basic Identity
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="clientName" className="flex items-center">
                      Client Name <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="John Doe"
                      className={cn(errors.clientName && "border-red-500")}
                    />
                    {errors.clientName && (
                      <p className="text-xs text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.clientName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="companyName">
                        Company Name <span className="text-gray-400 text-xs">(optional)</span>
                      </Label>
                      {formData.clientType === 'individual' && (
                        <span className="text-xs text-gray-500">Only for company clients</span>
                      )}
                    </div>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Acme Inc."
                      disabled={formData.clientType === 'individual'}
                      className={formData.clientType === 'individual' ? 'opacity-70' : ''}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label>Client Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'individual', label: 'Individual', icon: User },
                        { value: 'company', label: 'Company', icon: Building2 }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleInputChange('clientType', value)}
                          className={cn(
                            "flex items-center justify-center space-x-2 rounded-lg border-2 p-3 transition-all",
                            formData.clientType === value
                              ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                              : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <Mail className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      Email <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className={cn(errors.email && "border-red-500")}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-gray-400 text-xs">(optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label>Preferred Contact Method</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'email', label: 'Email', icon: Mail },
                        { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                        { value: 'call', label: 'Call', icon: Phone }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleInputChange('preferredContactMethod', value)}
                          className={cn(
                            "flex items-center justify-center space-x-2 rounded-lg border-2 p-3 transition-all",
                            formData.preferredContactMethod === value
                              ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                              : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Business Context */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <Globe className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Business Context
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry / Category</Label>
                    <select
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select industry...</option>
                      {INDUSTRIES.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <select
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select country...</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={formData.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {TIMEZONES.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">
                      Important for scheduling meetings and project deadlines
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Financial Defaults */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <DollarSign className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Financial Defaults
                  </h3>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 dark:bg-blue-900/20 dark:border-blue-800">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>Tip:</strong> These defaults will be pre-filled when creating invoices or projects for this client
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                    <select
                      id="defaultCurrency"
                      value={formData.defaultCurrency}
                      onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {CURRENCIES.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultHourlyRate">
                      Default Hourly Rate <span className="text-gray-400 text-xs">(optional)</span>
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="defaultHourlyRate"
                        type="number"
                        value={formData.defaultHourlyRate}
                        onChange={(e) => handleInputChange('defaultHourlyRate', e.target.value)}
                        placeholder="50"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                      <div className="flex-1">
                        <Label className="cursor-pointer font-medium">
                          Tax Applicable
                        </Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Enable if you need to charge tax (GST/VAT) for this client
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInputChange('taxApplicable', !formData.taxApplicable)}
                        className={cn(
                          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2",
                          formData.taxApplicable ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                            formData.taxApplicable ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Status & Notes */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <Tag className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Status & Notes
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Client Status</Label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {STATUS_OPTIONS.map(({ value, label, hint }) => (
                        <div key={value} className="space-y-1">
                          <button
                            type="button"
                            onClick={() => handleInputChange('clientStatus', value)}
                            className={cn(
                              "flex w-full items-center justify-center space-x-2 rounded-lg border-2 p-3 transition-all text-sm",
                              formData.clientStatus === value
                                ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                            )}
                          >
                            <span className="font-medium">{label}</span>
                          </button>
                          {formData.clientStatus === value && (
                            <p className="text-xs text-gray-500 text-center px-1">{hint}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="internalNotes">
                      Internal Notes <span className="text-gray-400 text-xs">(optional)</span>
                    </Label>
                    <textarea
                      id="internalNotes"
                      value={formData.internalNotes}
                      onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                      placeholder="Add any important details, preferences, or context about this client..."
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      These notes are only visible to you and your team
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving}
                className="bg-primary-600 hover:bg-primary-700"
              >
                {isSaving && (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {isSaving ? 'Creating...' : 'Create Client'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}