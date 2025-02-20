import { X, Calendar } from 'lucide-react';
import { FilterButton } from './utils';
import { useAssetStore } from '../../../utils/store/assets';

interface Filters {
  type: string;
  status: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  confidentiality: string;
  department: string;
  linkedAsset: string;
}

interface DocumentFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  documentTypes: string[];
  documentStatus: string[];
  categories: string[];
  confidentialityLevels: string[];
  departments: string[];
}

export default function DocumentFilters({
  filters,
  onFilterChange,
  documentTypes,
  documentStatus,
  categories,
  confidentialityLevels,
  departments
}: DocumentFiltersProps) {
  const { assets } = useAssetStore();

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button
          onClick={() => onFilterChange({
            type: 'All Types',
            status: 'All Status',
            category: 'All Categories',
            dateFrom: '',
            dateTo: '',
            confidentiality: 'All Levels',
            department: 'All Departments',
            linkedAsset: 'All Assets'
          })}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
          <FilterButton
            label="Type"
            options={documentTypes}
            value={filters.type}
            onChange={(value) => onFilterChange({ ...filters, type: value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <FilterButton
            label="Status"
            options={documentStatus}
            value={filters.status}
            onChange={(value) => onFilterChange({ ...filters, status: value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <FilterButton
            label="Category"
            options={categories}
            value={filters.category}
            onChange={(value) => onFilterChange({ ...filters, category: value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confidentiality</label>
          <FilterButton
            label="Confidentiality"
            options={confidentialityLevels}
            value={filters.confidentiality}
            onChange={(value) => onFilterChange({ ...filters, confidentiality: value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <FilterButton
            label="Department"
            options={departments}
            value={filters.department}
            onChange={(value) => onFilterChange({ ...filters, department: value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Linked Asset</label>
          <FilterButton
            label="Asset"
            options={['All Assets', 'Unlinked', ...assets.map(asset => asset.name)]}
            value={filters.linkedAsset}
            onChange={(value) => onFilterChange({ ...filters, linkedAsset: value })}
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.type !== 'All Types' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            Type: {filters.type}
            <button
              onClick={() => onFilterChange({ ...filters, type: 'All Types' })}
              className="ml-2 inline-flex items-center"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        )}
        {filters.status !== 'All Status' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Status: {filters.status}
            <button
              onClick={() => onFilterChange({ ...filters, status: 'All Status' })}
              className="ml-2 inline-flex items-center"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        )}
        {filters.category !== 'All Categories' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Category: {filters.category}
            <button
              onClick={() => onFilterChange({ ...filters, category: 'All Categories' })}
              className="ml-2 inline-flex items-center"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        )}
        {filters.linkedAsset !== 'All Assets' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Asset: {filters.linkedAsset}
            <button
              onClick={() => onFilterChange({ ...filters, linkedAsset: 'All Assets' })}
              className="ml-2 inline-flex items-center"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}