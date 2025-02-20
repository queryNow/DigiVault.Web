import { useState, useEffect } from 'react';
import { Search, Filter, LayoutGrid, List, ArrowUpDown, Upload } from 'lucide-react';
import DocumentMetadataDialog from '../../core/components/DocumentMetadataDialog';
import ShareDocumentDialog from '../../core/components/ShareDocumentDialog';
import DocumentUpload from '../../core/components/DocumentUpload';
import DocumentGrid from '../../core/components/DocuVault/DocumentGrid';
import DocumentTable from '../../core/components/DocuVault/DocumentTable';
import DocumentFilters from '../../core/components/DocuVault/DocumentFilters';
import { useDocumentStore } from '../../utils/store/documents';

// Constants
const DOCUMENT_TYPES = ['All Types', 'Legal Document', 'Financial', 'Marketing', 'Technical', 'Other'];
const DOCUMENT_STATUS = ['All Status', 'active', 'archived', 'pending'];
const CATEGORIES = [
  'All Categories',
  'Contracts',
  'Financial Reports',
  'Marketing Materials',
  'Technical Documentation',
  'Risk Management',
  'Compliance',
  'Valuation Reports',
  'Due Diligence',
  'ESG Reports',
  'Performance Reports',
  'Investment Analysis',
  'Financial Analysis'
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Name A-Z', value: 'name-asc' },
  { label: 'Name Z-A', value: 'name-desc' },
  { label: 'Size (Largest)', value: 'size-desc' },
  { label: 'Size (Smallest)', value: 'size-asc' },
];

const CONFIDENTIALITY_LEVELS = ['All Levels', 'Low', 'Medium', 'High'];
const DEPARTMENTS = ['All Departments', 'Legal', 'Finance', 'Marketing', 'Risk Management', 'Compliance', 'ESG', 'Investment'];

export default function DocuVault() {
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [filters, setFilters] = useState({
    type: 'All Types',
    status: 'All Status',
    category: 'All Categories',
    dateFrom: '',
    dateTo: '',
    confidentiality: 'All Levels',
    department: 'All Departments',
    linkedAsset: 'All Assets'
  });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [showMetadataDialog, setShowMetadataDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const { documents, loading, error, fetchDocuments, addDocument } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Calculate metrics

  // Filter and sort documents
  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = filters.type === 'All Types' || doc.type === filters.type;
      const matchesStatus = filters.status === 'All Status' || doc.status === filters.status;
      const matchesCategory = filters.category === 'All Categories' || doc.category === filters.category;
      const matchesDateFrom = !filters.dateFrom || new Date(doc.uploadedAt) >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || new Date(doc.uploadedAt) <= new Date(filters.dateTo);
      const matchesConfidentiality = filters.confidentiality === 'All Levels' ||
        doc.metadata?.confidentiality === filters.confidentiality;
      const matchesDepartment = filters.department === 'All Departments' ||
        doc.metadata?.department === filters.department;
      const matchesLinkedAsset = filters.linkedAsset === 'All Assets' ||
        (filters.linkedAsset === 'Unlinked' ? !doc.assetName : doc.assetName === filters.linkedAsset);

      return matchesSearch && matchesType && matchesStatus && matchesCategory &&
        matchesDateFrom && matchesDateTo && matchesConfidentiality &&
        matchesDepartment && matchesLinkedAsset;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'oldest':
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'size-desc':
          return b.size - a.size;
        case 'size-asc':
          return a.size - b.size;
        default:
          return 0;
      }
    });

  const handleViewDetails = (doc: any) => {
    setSelectedDocument(doc);
    setShowMetadataDialog(true);
  };

  const handleShare = (doc: any) => {
    setSelectedDocument(doc);
    setShowShareDialog(true);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading documents: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">DocuVault</h1>
          <p className="mt-1 text-sm text-gray-500">
            Centralized document management system
          </p>
        </div>
        <button
          onClick={() => setShowUploadDialog(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Upload className="-ml-1 mr-2 h-5 w-5" />
          Upload Document
        </button>
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
            placeholder="Search documents by name, type, asset, or tags..."
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
              value !== 'All Categories' &&
              value !== 'All Levels' &&
              value !== 'All Departments' &&
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
        <DocumentFilters
          filters={filters}
          onFilterChange={setFilters}
          documentTypes={DOCUMENT_TYPES}
          documentStatus={DOCUMENT_STATUS}
          categories={CATEGORIES}
          confidentialityLevels={CONFIDENTIALITY_LEVELS}
          departments={DEPARTMENTS}
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
            Showing {filteredDocuments.length} documents
          </div>

          {/* Document List */}
          {view === 'table' ? (
            <DocumentTable
              documents={filteredDocuments}
              onViewDetails={handleViewDetails}
              onShare={handleShare}
            />
          ) : (
            <DocumentGrid
              documents={filteredDocuments}
              onViewDetails={handleViewDetails}
              onShare={handleShare}
            />
          )}
        </>)}

      {/* Upload Dialog */}
      {showUploadDialog && (
        <DocumentUpload
          onUpload={async (documents) => {
            try {
              await Promise.all(documents.map(doc => addDocument(doc)));
              setShowUploadDialog(false);
            } catch (error) {
              console.error('Error uploading documents:', error);
            }
          }}
          onCancel={() => setShowUploadDialog(false)}
        />
      )}

      {/* Document Metadata Dialog */}
      {showMetadataDialog && selectedDocument && (
        <DocumentMetadataDialog
          isOpen={showMetadataDialog}
          onClose={() => {
            setShowMetadataDialog(false);
            setSelectedDocument(null);
          }}
          document={selectedDocument}
        />
      )}

      {/* Share Document Dialog */}
      {showShareDialog && selectedDocument && (
        <ShareDocumentDialog
          isOpen={showShareDialog}
          onClose={() => {
            setShowShareDialog(false);
            setSelectedDocument(null);
          }}
          documentName={selectedDocument.name}
        />
      )}
    </div>
  );
}