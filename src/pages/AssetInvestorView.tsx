import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, DollarSign, TrendingUp, Clock, AlertTriangle, Users, BarChart as ChartBar, FileText, Shield, MapPin, Tag, Info, Download, Share2 } from 'lucide-react';
import { useAssetStore } from '../store/assets';
import { useDocumentStore } from '../store/documents';
import DocumentMetadataDialog from '../components/DocumentMetadataDialog';
import ShareDocumentDialog from '../components/ShareDocumentDialog';

export default function AssetInvestorView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAssetById } = useAssetStore();
  const { documents } = useDocumentStore();
  const asset = getAssetById(id || '');

  const [showMetadataDialog, setShowMetadataDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);

  // Filter documents for this asset
  const assetDocuments = documents.filter(doc => doc.assetId === id);

  if (!asset) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Asset not found</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="mt-2 text-sm text-red-600 hover:text-red-500"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <img
          src={asset.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'}
          alt={asset.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{asset.name}</h1>
              <div className="mt-2 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{asset.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">${asset.value.toLocaleString()}</div>
              <div className="text-sm opacity-75">Total Value</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Investment Metrics */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Investment Overview</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200">
              <div className="p-6">
                <dt className="text-sm font-medium text-gray-500">Minimum Investment</dt>
                <dd className="mt-1 flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-1" />
                  <span className="text-2xl font-semibold text-gray-900">
                    ${Number(asset.minimumInvestment).toLocaleString()}
                  </span>
                </dd>
              </div>
              <div className="p-6">
                <dt className="text-sm font-medium text-gray-500">Expected Return</dt>
                <dd className="mt-1 flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-1" />
                  <span className="text-2xl font-semibold text-gray-900">
                    {asset.expectedReturn}%
                  </span>
                </dd>
              </div>
              <div className="p-6">
                <dt className="text-sm font-medium text-gray-500">Investment Term</dt>
                <dd className="mt-1 flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-1" />
                  <span className="text-2xl font-semibold text-gray-900">
                    {asset.investmentTerm}
                  </span>
                  <span className="ml-1 text-gray-500">months</span>
                </dd>
              </div>
              <div className="p-6">
                <dt className="text-sm font-medium text-gray-500">Risk Level</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    asset.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                    asset.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {asset.riskLevel} Risk
                  </span>
                </dd>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Historical Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">YTD Return</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">{asset.performance.ytd}%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">1 Year</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">{asset.performance.oneYear}%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">3 Year</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">{asset.performance.threeYear}%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">5 Year</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">{asset.performance.fiveYear}%</p>
              </div>
            </div>
          </div>

          {/* Asset Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">About this Investment</h2>
            <p className="text-gray-600 whitespace-pre-line">{asset.description}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Asset Class</h3>
                <div className="mt-2 flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-900">{asset.assetClass}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sector</h3>
                <div className="mt-2 flex items-center">
                  <Tag className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-900">{asset.sector}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Documents */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Investment Documents</h2>
            <div className="space-y-4">
              {assetDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {doc.size} MB • Updated {new Date(doc.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedDocument(doc);
                        setShowMetadataDialog(true);
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Info className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDocument(doc);
                        setShowShareDialog(true);
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Investment Action Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-900">${asset.value.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Investment Value</div>
            </div>
            <div className="mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Minimum Investment</span>
                <span className="text-gray-900 font-medium">
                  ${Number(asset.minimumInvestment).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Frequency</span>
                <span className="text-gray-900 font-medium">{asset.paymentFrequency}</span>
              </div>
            </div>
            <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Invest Now
            </button>
          </div>

          {/* Fund Manager */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Fund Manager</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-900">{asset.managerName}</div>
                <div className="text-sm text-gray-500">{asset.companyName}</div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Regulatory Licenses</h3>
                <div className="flex flex-wrap gap-2">
                  {asset.regulatoryLicenses.map((license, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Shield className="h-3 w-3 mr-1" />
                      {license}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Key Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Occupancy Rate</span>
                <span className="text-sm font-medium text-gray-900">{asset.occupancyRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Tenants</span>
                <span className="text-sm font-medium text-gray-900">{asset.tenants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Valuation</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(asset.lastValuation).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Next Valuation</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(asset.nextValuation).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Dialogs */}
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