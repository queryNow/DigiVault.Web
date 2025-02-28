import React from 'react';
import { Building2, Tag, Globe, AlertTriangle } from 'lucide-react';

const ASSET_TYPES = [
  { id: 1, name: 'Real Estate', icon: Building2, count: 12 },
  { id: 2, name: 'Private Equity', icon: Tag, count: 8 },
  { id: 3, name: 'Fixed Income', icon: Tag, count: 5 },
  { id: 4, name: 'Infrastructure', icon: Building2, count: 3 }
];

const REGIONS = [
  { id: 1, name: 'North America', icon: Globe, count: 15 },
  { id: 2, name: 'Europe', icon: Globe, count: 10 },
  { id: 3, name: 'Asia Pacific', icon: Globe, count: 8 }
];

const RISK_LEVELS = [
  { id: 1, name: 'Low', icon: AlertTriangle, count: 10, color: 'green' },
  { id: 2, name: 'Medium', icon: AlertTriangle, count: 15, color: 'yellow' },
  { id: 3, name: 'High', icon: AlertTriangle, count: 8, color: 'red' }
];

export default function AssetSettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Asset Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure asset types, regions, and risk levels
        </p>
      </div>

      {/* Asset Types */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Asset Types</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Add Asset Type
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {ASSET_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <li key={type.id}>
                  <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{type.name}</div>
                        <div className="text-sm text-gray-500">{type.count} assets</div>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Regions */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Regions</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Add Region
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {REGIONS.map((region) => {
              const Icon = region.icon;
              return (
                <li key={region.id}>
                  <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{region.name}</div>
                        <div className="text-sm text-gray-500">{region.count} assets</div>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Risk Levels */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Risk Levels</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Add Risk Level
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {RISK_LEVELS.map((level) => {
              const Icon = level.icon;
              return (
                <li key={level.id}>
                  <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex items-center">
                      <Icon className={`h-5 w-5 text-${level.color}-500 mr-3`} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{level.name}</div>
                        <div className="text-sm text-gray-500">{level.count} assets</div>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}