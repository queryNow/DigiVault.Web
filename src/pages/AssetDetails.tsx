import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Edit, 
  Share2, 
  Check, 
  Clock, 
  Building2, 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  Briefcase,
  Globe,
  Tag,
  Shield,
  Eye,
  Download,
  Trash2
} from 'lucide-react';
import { useAssetStore } from '../store/assets';
import { useDocumentStore } from '../store/documents';
import DocumentUpload from '../components/DocumentUpload';
import DocumentMetadataDialog from '../components/DocumentMetadataDialog';
import ShareDocumentDialog from '../components/ShareDocumentDialog';

export default function AssetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAssetById } = useAssetStore();
  const { documents, addDocument } = useDocumentStore();
  const asset = getAssetById(id || '');
  
  const [showUploadDialog, setShowUploadDialog] = useState(false);
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
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-start py-5 border-b border-gray-200">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">{asset.name}</h1>
            <span className={`ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              asset.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {asset.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{asset.shortDescription}</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(`/assets/${id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
          {asset.status === 'published' ? (
            <button
              onClick={() => {/* Handle remove from marketplace */}}
              className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Remove from Marketplace
            </button>
          ) : (
            <button
              onClick={() => navigate('/marketplace/list')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Share2 className="h-4 w-4 mr-2" />
              List on Marketplace
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Value</p>
                  <p className="text-lg font-semibold text-gray-900">${asset.value.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Users className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Occupancy</p>
                  <p className="text-lg font-semibold text-gray-900">{asset.occupancyRate}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Expected Return</p>
                  <p className="text-lg font-semibold text-gray-900">{asset.expectedReturn}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Term</p>
                  <p className="text-lg font-semibold text-gray-900">{asset.investmentTerm} months</p>
                </div>
              </div>
            </div>
          </div>

          {/* Asset Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Asset Information</h2>
            <div className="space-y-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Asset Class</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.assetClass}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Sub-Class</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.subClass}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Sector</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.sector}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.location}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Currency</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.currency}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Frequency</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.paymentFrequency}</dd>
                </div>
              </dl>
              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{asset.description}</dd>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Performance</h2>
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

          {/* Risk & Compliance */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Risk & Compliance</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Risk Level</h3>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    asset.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                    asset.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {asset.riskLevel} Risk
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Risk Factors</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {asset.riskFactors.map((factor, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Regulatory Compliance</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {asset.regulatoryCompliance.map((compliance, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Shield className="h-4 w-4 mr-1" />
                      {compliance}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Investor Restrictions</h3>
                <p className="mt-1 text-sm text-gray-900">{asset.investorRestrictions}</p>
              </div>
            </div>
          </div>

          {/* Signatures Section */}
          {asset.signatures && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Required Signatures</h2>
              <div className="space-y-4">
                {asset.signatures.required.map((signer) => {
                  const isCompleted = asset.signatures?.completed.includes(signer);
                  const isPending = asset.signatures?.pending.includes(signer);
                  
                  return (
                    <div key={signer} className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {isCompleted ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{signer}</p>
                          <p className="text-xs text-gray-500">
                            {isCompleted ? 'Signed' : isPending ? 'Pending' : 'Not started'}
                          </p>
                        </div>
                      </div>
                      {isCompleted && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Fund Manager */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Fund Manager</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{asset.managerName}</p>
                  <p className="text-sm text-gray-500">{asset.companyName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm text-gray-900">{asset.region}</p>
                  <p className="text-sm text-gray-500">{asset.country}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Regulatory Licenses</h3>
                <div className="flex flex-wrap gap-2">
                  {asset.regulatoryLicenses.map((license, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {license}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Documents</h2>
              <button
                onClick={() => setShowUploadDialog(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-indigo-600 hover:text-indigo-700"
              >
                <FileText className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {assetDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {doc.size} MB • {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        doc.metadata.confidentiality === 'High' ? 'bg-red-100 text-red-800' :
                        doc.metadata.confidentiality === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {doc.metadata.confidentiality} Confidentiality
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedDocument(doc);
                        setShowMetadataDialog(true);
                      }}
                      className="text-gray-400 hover:text-gray-500"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDocument(doc);
                        setShowShareDialog(true);
                      }}
                      className="text-gray-400 hover:text-gray-500"
                      title="Share"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-gray-500"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
              {assetDocuments.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No documents uploaded yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
          preselectedAsset={asset}
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