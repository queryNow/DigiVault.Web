import React from 'react';
import { ChevronDown } from 'lucide-react';

const ASSET_TYPES = ['All Types', 'Real Estate', 'Private Equity', 'Fixed Income', 'Infrastructure', 'Hedge Funds', 'Commodities'];
const REGIONS = ['All Regions', 'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'];
const RISK_LEVELS = ['All Risk Levels', 'Low', 'Medium', 'High'];
const INVESTMENT_TERMS = ['All Terms', '0-12 months', '1-3 years', '3-5 years', '5+ years'];

interface MarketplaceFilters {
  type: string;
  region: string;
  riskLevel: string;
  investmentTerm: string;
  minPrice: string;
  maxPrice: string;
}

interface Props {
  filters: MarketplaceFilters;
  onFilterChange: (filters: MarketplaceFilters) => void;
}

export default function MarketplaceFilters({ filters, onFilterChange }: Props) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Asset Type</label>
          <div className="mt-1 relative">
            <select
              value={filters.type}
              onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {ASSET_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Region</label>
          <div className="mt-1 relative">
            <select
              value={filters.region}
              onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Risk Level</label>
          <div className="mt-1 relative">
            <select
              value={filters.riskLevel}
              onChange={(e) => onFilterChange({ ...filters, riskLevel: e.target.value })}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {RISK_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Investment Term</label>
          <div className="mt-1 relative">
            <select
              value={filters.investmentTerm}
              onChange={(e) => onFilterChange({ ...filters, investmentTerm: e.target.value })}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {INVESTMENT_TERMS.map(term => (
                <option key={term} value={term}>{term}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Price Range</label>
          <div className="mt-1 grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
                placeholder="Min Price"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
                placeholder="Max Price"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}