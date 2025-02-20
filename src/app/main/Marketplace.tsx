import { useState, useEffect } from 'react';
import { Search, LayoutGrid, List, Filter, ChevronDown } from 'lucide-react';
import { useAssetStore } from '../../utils/store/assets';
import MarketplaceFilters from '../../core/components/Marketplace/MarketplaceFilters';
import MarketplaceMetrics from '../../core/components/Marketplace/MarketplaceMetrics';
import AssetCard from '../../core/components/Marketplace/AssetCard';
import AssetListItem from '../../core/components/Marketplace/AssetListItem';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Highest Value', value: 'value-desc' },
  { label: 'Lowest Value', value: 'value-asc' },
  { label: 'Highest Return', value: 'return-desc' },
  { label: 'Lowest Return', value: 'return-asc' }
];

export default function Marketplace() {
  const { assets, loading, error, fetchAssets } = useAssetStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'All Types',
    region: 'All Regions',
    riskLevel: 'All Risk Levels',
    investmentTerm: 'All Terms',
    minPrice: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Get published assets only
  const publishedAssets = assets.filter(asset => asset.status === 'published');

  // Filter assets based on search and filters
  const filteredAssets = publishedAssets
    .filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filters.type === 'All Types' || asset.type === filters.type;
      const matchesRegion = filters.region === 'All Regions' || asset.region === filters.region;
      const matchesRisk = filters.riskLevel === 'All Risk Levels' || asset.riskLevel === filters.riskLevel;
      const matchesTerm = filters.investmentTerm === 'All Terms' ||
        (filters.investmentTerm === '0-12 months' && Number(asset.investmentTerm) <= 12) ||
        (filters.investmentTerm === '1-3 years' && Number(asset.investmentTerm) > 12 && Number(asset.investmentTerm) <= 36) ||
        (filters.investmentTerm === '3-5 years' && Number(asset.investmentTerm) > 36 && Number(asset.investmentTerm) <= 60) ||
        (filters.investmentTerm === '5+ years' && Number(asset.investmentTerm) > 60);
      const matchesMinPrice = !filters.minPrice || asset.value >= Number(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || asset.value <= Number(filters.maxPrice);

      return matchesSearch && matchesType && matchesRegion && matchesRisk &&
        matchesTerm && matchesMinPrice && matchesMaxPrice;
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
        case 'return-desc':
          return Number(b.expectedReturn) - Number(a.expectedReturn);
        case 'return-asc':
          return Number(a.expectedReturn) - Number(b.expectedReturn);
        default:
          return 0;
      }
    });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading marketplace: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Investment Marketplace</h1>
          <p className="mt-1 text-sm text-gray-500">
            Discover and invest in tokenized assets across multiple sectors
          </p>
        </div>
      </div>

      {/* Metrics - Pass only published assets */}
      <div className="mb-8">
        <MarketplaceMetrics assets={publishedAssets} />
      </div>

      {/* Search and View Controls */}
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
            placeholder="Search assets by name, type, or location..."
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
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
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
          </button>

          <div className="flex border border-gray-300 rounded-md p-1 bg-white">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded ${view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded ${view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <MarketplaceFilters
          filters={filters}
          onFilterChange={setFilters}
        />
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-500">
            Showing {filteredAssets.length} published assets
          </div>

          {/* Asset List */}
          {view === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAssets.map(asset => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssets.map(asset => (
                <AssetListItem key={asset.id} asset={asset} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No published assets found matching your criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}