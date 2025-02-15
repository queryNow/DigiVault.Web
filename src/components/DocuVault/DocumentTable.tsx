import React from 'react';
import { Tag, Building2, Eye, Share2, Download, Trash2 } from 'lucide-react';
import { Document } from '../../store/documents';
import { getDocumentIcon } from './utils';

interface DocumentTableProps {
  documents: Document[];
  onViewDetails: (doc: Document) => void;
  onShare: (doc: Document) => void;
}

export default function DocumentTable({ documents, onViewDetails, onShare }: DocumentTableProps) {
  return (
    <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Document
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category & Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Related Asset
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img className="h-10 w-10 rounded object-cover" src={doc.thumbnail} alt="" />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      {getDocumentIcon(doc.type)}
                      <span className="ml-2 text-sm font-medium text-indigo-600 hover:text-indigo-900">
                        {doc.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {doc.size} MB • Version {doc.version}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {doc.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-900">{doc.category}</p>
                    <p className="text-sm text-gray-500">{doc.type}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-900">{doc.assetName || 'No linked asset'}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded by {doc.uploadedBy}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  doc.status === 'active' ? 'bg-green-100 text-green-800' : 
                  doc.status === 'archived' ? 'bg-gray-100 text-gray-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onViewDetails(doc)}
                    className="text-gray-400 hover:text-gray-500"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onShare(doc)}
                    className="text-gray-400 hover:text-gray-500"
                    title="Share"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-500">
                    <Download className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-red-500">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}