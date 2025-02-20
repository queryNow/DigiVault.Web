import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Filter,
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  X,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Tag,
  Building2,
  Loader2
} from 'lucide-react';
import { useAssetStore } from '../../utils/store/assets';

const ASSET_TYPES = ['All Types', 'Real Estate', 'Securities', 'Private Equity', 'Infrastructure', 'Commodities'];
const ASSET_STATUS = ['All Status', 'published', 'draft', 'archived'];
const RISK_LEVELS = ['All Risks', 'Low', 'Medium', 'High'];
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Highest Value', value: 'value-desc' },
  { label: 'Lowest Value', value: 'value-asc' },
  { label: 'Name A-Z', value: 'name-asc' },
  { label: 'Name Z-A', value: 'name-desc' },
];

export default function AssetManagement() {
  const { assets, loading, error, fetchAssets } = useAssetStore();
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'All Types',
    status: 'All Status',
    risk: 'All Risks',
    minValue: '',
    maxValue: '',
    dateFrom: '',
    dateTo: '',
  });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Filter and sort assets
  const filteredAssets = assets
    .filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.managerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filters.type === 'All Types' || asset.type === filters.type;
      const matchesStatus = filters.status === 'All Status' || asset.status === filters.status;
      const matchesRisk = filters.risk === 'All Risks' || asset.riskLevel === filters.risk;
      const matchesMinValue = !filters.minValue || asset.value >= Number(filters.minValue);
      const matchesMaxValue = !filters.maxValue || asset.value <= Number(filters.maxValue);
      const matchesDateFrom = !filters.dateFrom || new Date(asset.createdAt) >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || new Date(asset.createdAt) <= new Date(filters.dateTo);

      return matchesSearch && matchesType && matchesStatus && matchesRisk &&
        matchesMinValue && matchesMaxValue && matchesDateFrom && matchesDateTo;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'value-desc':
          return b.value - a.value;
        case 'value-asc':
          return a.value - b.value;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  const FilterButton = ({ options, value, onChange }: {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading assets: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Asset Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor your investment assets
          </p>
        </div>
        <Link
          to="/assets/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          New Asset
        </Link>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 w-full sm:w-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search assets by name, type, or manager..."
          />
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full sm:w-auto bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${showFilters
              ? 'border-indigo-500 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
          >
            <Filter className="-ml-1 mr-2 h-5 w-5" />
            Filters
            {Object.values(filters).some(value =>
              value !== 'All Types' &&
              value !== 'All Status' &&
              value !== 'All Risks' &&
              value !== ''
            ) && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Active
                </span>
              )}
          </button>

          <div className="flex border border-gray-300 rounded-md p-1 bg-white">
            <button
              onClick={() => setView('table')}
              className={`p-2 rounded ${view === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded ${view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            <button
              onClick={() => {
                setFilters({
                  type: 'All Types',
                  status: 'All Status',
                  risk: 'All Risks',
                  minValue: '',
                  maxValue: '',
                  dateFrom: '',
                  dateTo: '',
                });
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
              <FilterButton
                label="Type"
                options={ASSET_TYPES}
                value={filters.type}
                onChange={(value) => setFilters({ ...filters, type: value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <FilterButton
                label="Status"
                options={ASSET_STATUS}
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
              <FilterButton
                label="Risk"
                options={RISK_LEVELS}
                value={filters.risk}
                onChange={(value) => setFilters({ ...filters, risk: value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minValue}
                  onChange={(e) => setFilters({ ...filters, minValue: e.target.value })}
                  className="w-1/2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxValue}
                  onChange={(e) => setFilters({ ...filters, maxValue: e.target.value })}
                  className="w-1/2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
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
                  onClick={() => setFilters({ ...filters, type: 'All Types' })}
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
                  onClick={() => setFilters({ ...filters, status: 'All Status' })}
                  className="ml-2 inline-flex items-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            )}
            {filters.risk !== 'All Risks' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Risk: {filters.risk}
                <button
                  onClick={() => setFilters({ ...filters, risk: 'All Risks' })}
                  className="ml-2 inline-flex items-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-500">
            Showing {filteredAssets.length} assets
          </div>

          {/* Asset List */}
          {view === 'table' ? (
            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value & Performance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk & Manager
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-full object-cover" src={asset.image} alt="" />
                          </div>
                          <div className="ml-4">
                            <Link to={`/assets/${asset.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                              {asset.name}
                            </Link>
                            <p className="text-sm text-gray-500">Created {new Date(asset.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Tag className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-900">{asset.type}</p>
                            <p className="text-sm text-gray-500">{asset.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-900">${asset.value.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">ROI: {asset.expectedReturn}%</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${asset.status === 'published' ? 'bg-green-100 text-green-800' :
                          asset.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-900">{asset.managerName}</p>
                            <p className="text-sm text-gray-500">Risk: {asset.riskLevel}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="relative h-48">
                    <img
                      src={asset.image}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${asset.status === 'published' ? 'bg-green-100 text-green-800' :
                        asset.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {asset.status}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <Link to={`/assets/${asset.id}`} className="text-lg font-medium text-indigo-600 hover:text-indigo-900">
                      {asset.name}
                    </Link>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Tag className="h-4 w-4 mr-1" />
                      {asset.type}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Building2 className="h-4 w-4 mr-1" />
                      {asset.location}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="ml-1 text-lg font-semibold text-gray-900">
                          ${asset.value.toLocaleString()}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${asset.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                        asset.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                        {asset.riskLevel} Risk
                      </span>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-sm">
                      <span className="text-gray-500">ROI: {asset.expectedReturn}%</span>
                      <span className="text-gray-500">{new Date(asset.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}