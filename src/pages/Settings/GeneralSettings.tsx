import React, { useState } from 'react';
import { Upload, Globe, Clock, DollarSign, Palette, Image, Check } from 'lucide-react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

interface GeneralSettings {
  platformName: string;
  language: string;
  timezone: string;
  dateFormat: string;
  logo: File | null;
  favicon: File | null;
  theme: ThemeColors;
  currency: string;
  numberFormat: string;
  emailDomain: string;
  supportEmail: string;
  termsUrl: string;
  privacyUrl: string;
}

export default function GeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettings>({
    platformName: 'iTouch Platform',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    logo: null,
    favicon: null,
    theme: {
      primary: '#4F46E5',
      secondary: '#1F2937',
      accent: '#10B981',
      background: '#F9FAFB'
    },
    currency: 'USD',
    numberFormat: '1,234.56',
    emailDomain: 'itouch.com',
    supportEmail: 'support@itouch.com',
    termsUrl: 'https://itouch.com/terms',
    privacyUrl: 'https://itouch.com/privacy'
  });

  const [previewLogo, setPreviewLogo] = useState<string>('https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=64&h=64&fit=crop&auto=format');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const languages = [
    { code: 'en', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese (Simplified)' }
  ];

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Singapore',
    'Australia/Sydney'
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (UK)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
    { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (EU)' }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' }
  ];

  const handleSave = () => {
    // Simulate saving
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSettings({ ...settings, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure basic platform settings and branding
          </p>
        </div>

        {/* Platform Identity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Platform Identity</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="platformName" className="block text-sm font-medium text-gray-700">
                Platform Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="platformName"
                  id="platformName"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Logo</label>
              <div className="mt-1 flex items-center">
                <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={previewLogo}
                    alt="Platform Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <label
                  htmlFor="logo-upload"
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <span>Change</span>
                  <input
                    id="logo-upload"
                    name="logo-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Localization */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Localization</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-gray-400" />
                  Language
                </div>
              </label>
              <div className="mt-1">
                <select
                  id="language"
                  name="language"
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  Timezone
                </div>
              </label>
              <div className="mt-1">
                <select
                  id="timezone"
                  name="timezone"
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  Date Format
                </div>
              </label>
              <div className="mt-1">
                <select
                  id="dateFormat"
                  name="dateFormat"
                  value={settings.dateFormat}
                  onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  {dateFormats.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  Default Currency
                </div>
              </label>
              <div className="mt-1">
                <select
                  id="currency"
                  name="currency"
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            <div className="flex items-center">
              <Palette className="h-4 w-4 mr-2 text-gray-400" />
              Theme Settings
            </div>
          </h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                Primary Color
              </label>
              <div className="mt-1 flex items-center space-x-3">
                <input
                  type="color"
                  name="primaryColor"
                  id="primaryColor"
                  value={settings.theme.primary}
                  onChange={(e) => setSettings({
                    ...settings,
                    theme: { ...settings.theme, primary: e.target.value }
                  })}
                  className="h-8 w-8 p-0 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.theme.primary}
                  onChange={(e) => setSettings({
                    ...settings,
                    theme: { ...settings.theme, primary: e.target.value }
                  })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
                Secondary Color
              </label>
              <div className="mt-1 flex items-center space-x-3">
                <input
                  type="color"
                  name="secondaryColor"
                  id="secondaryColor"
                  value={settings.theme.secondary}
                  onChange={(e) => setSettings({
                    ...settings,
                    theme: { ...settings.theme, secondary: e.target.value }
                  })}
                  className="h-8 w-8 p-0 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.theme.secondary}
                  onChange={(e) => setSettings({
                    ...settings,
                    theme: { ...settings.theme, secondary: e.target.value }
                  })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700">
                Support Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="supportEmail"
                  id="supportEmail"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="emailDomain" className="block text-sm font-medium text-gray-700">
                Email Domain
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="emailDomain"
                  id="emailDomain"
                  value={settings.emailDomain}
                  onChange={(e) => setSettings({ ...settings, emailDomain: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Legal Information</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="termsUrl" className="block text-sm font-medium text-gray-700">
                Terms of Service URL
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  name="termsUrl"
                  id="termsUrl"
                  value={settings.termsUrl}
                  onChange={(e) => setSettings({ ...settings, termsUrl: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="privacyUrl" className="block text-sm font-medium text-gray-700">
                Privacy Policy URL
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  name="privacyUrl"
                  id="privacyUrl"
                  value={settings.privacyUrl}
                  onChange={(e) => setSettings({ ...settings, privacyUrl: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSave}
            className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showSaveSuccess ? (
              <>
                <Check className="h-4 w-4 mr-1.5" />
                Saved!
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}