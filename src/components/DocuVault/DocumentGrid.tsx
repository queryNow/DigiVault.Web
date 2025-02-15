import React from 'react';
import { Tag, Building2, Eye, Share2, Download, Trash2 } from 'lucide-react';
import { Document } from '../../store/documents';
import { getDocumentIcon } from './utils';

interface DocumentGridProps {
  documents: Document[];
  onViewDetails: (doc: Document) => void;
  onShare: (doc: Document) => void;
}

export default function DocumentGrid({ documents, onViewDetails, onShare }: DocumentGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <div key={doc.id} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="relative h-48">
            <img
              src={doc.thumbnail}
              alt={doc.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                doc.status === 'active' ? 'bg-green-100 text-green-800' : 
                doc.status === 'archived' ? 'bg-gray-100 text-gray-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {doc.status}
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center">
              {getDocumentIcon(doc.type)}
              <h3 className="ml-2 text-lg font-medium text-gray-900">{doc.name}</h3>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Tag className="h-4 w-4 mr-2" />
              {doc.category}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Building2 className="h-4 w-4 mr-2" />
              {doc.assetName || 'No linked asset'}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {doc.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {doc.size} MB • Version {doc.version}
              </span>
              <div className="flex space-x-2">
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
          </div>
        </div>
      ))}
    </div>
  );
}