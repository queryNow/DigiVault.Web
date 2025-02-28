import React from 'react';

const ASSET_CLASSES = [
  'Real Estate',
  'Private Equity',
  'Fixed Income',
  'Infrastructure',
  'Hedge Funds',
  'Commodities'
];

const SECTORS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Real Estate',
  'Energy',
  'Consumer Goods',
  'Industrial',
  'Materials',
  'Telecommunications',
  'Utilities'
];

const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'];
const COUNTRIES = {
  'North America': ['United States', 'Canada', 'Mexico'],
  'Europe': ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain'],
  'Asia Pacific': ['Japan', 'China', 'Singapore', 'Australia', 'South Korea'],
  'Latin America': ['Brazil', 'Argentina', 'Chile', 'Colombia'],
  'Middle East & Africa': ['UAE', 'Saudi Arabia', 'South Africa', 'Israel']
};

interface AssetClassificationProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function AssetClassification({ formData, setFormData }: AssetClassificationProps) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Classification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="assetClass" className="block text-sm font-medium text-gray-700">
              Asset Class
            </label>
            <select
              id="assetClass"
              value={formData.assetClass}
              onChange={(e) => setFormData({ ...formData, assetClass: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Asset Class</option>
              {ASSET_CLASSES.map(assetClass => (
                <option key={assetClass} value={assetClass}>{assetClass}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
              Sector
            </label>
            <select
              id="sector"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Sector</option>
              {SECTORS.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
              Region
            </label>
            <select
              id="region"
              value={formData.region}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  region: e.target.value,
                  country: '' // Reset country when region changes
                });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Region</option>
              {REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled={!formData.region}
            >
              <option value="">Select Country</option>
              {formData.region && COUNTRIES[formData.region as keyof typeof COUNTRIES].map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}