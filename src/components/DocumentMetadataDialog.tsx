import React from 'react';
import { X, FileText, Calendar, User, Tag, History, Clock, Building2 } from 'lucide-react';

interface Version {
  version: string;
  date: string;
  author: string;
  changes: string;
}

interface DocumentMetadata {
  id: string;
  name: string;
  type: string;
  category: string;
  size: number;
  createdAt: string;
  lastModified: string;
  lastViewed: string;
  status: string;
  uploadedBy: string;
  currentVersion: string;
  assetName: string;
  tags: string[];
  versions: Version[];
  metadata: {
    documentType: string;
    expiryDate?: string;
    confidentiality: string;
    department: string;
    reviewStatus: string;
    reviewDate?: string;
    reviewedBy?: string;
    comments?: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentMetadata;
}

export default function DocumentMetadataDialog({ isOpen, onClose, document }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Document Information</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Basic Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Name:</span>
                    <span className="ml-2 text-sm text-gray-900">{document.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Type:</span>
                    <span className="ml-2 text-sm text-gray-900">{document.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Related Asset:</span>
                    <span className="ml-2 text-sm text-gray-900">{document.assetName}</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Timeline</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Created:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {new Date(document.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Last Modified:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {new Date(document.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Uploaded By:</span>
                    <span className="ml-2 text-sm text-gray-900">{document.uploadedBy}</span>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-sm font-medium text-gray-900">Document Metadata</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Document Type</label>
                    <p className="mt-1 text-sm text-gray-900">{document.metadata.documentType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confidentiality</label>
                    <p className="mt-1 text-sm text-gray-900">{document.metadata.confidentiality}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="mt-1 text-sm text-gray-900">{document.metadata.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Review Status</label>
                    <p className="mt-1 text-sm text-gray-900">{document.metadata.reviewStatus}</p>
                  </div>
                  {document.metadata.expiryDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(document.metadata.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {document.metadata.reviewDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Review</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(document.metadata.reviewDate).toLocaleDateString()}
                        {document.metadata.reviewedBy && ` by ${document.metadata.reviewedBy}`}
                      </p>
                    </div>
                  )}
                </div>
                {document.metadata.comments && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Comments</label>
                    <p className="mt-1 text-sm text-gray-900">{document.metadata.comments}</p>
                  </div>
                )}
              </div>

              {/* Version History */}
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <History className="w-5 h-5 text-gray-400 mr-2" />
                  <h4 className="text-sm font-medium text-gray-900">Version History</h4>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Changes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {document.versions.map((version, index) => (
                        <tr key={index} className={index === 0 ? 'bg-blue-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {version.version}
                            {index === 0 && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Current
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(version.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {version.author}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {version.changes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}