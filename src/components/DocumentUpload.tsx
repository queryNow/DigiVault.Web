import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileSpreadsheet, FileCheck, FileImage, FileCog, FileWarning, Save, Link2 } from 'lucide-react';
import { Document } from '../store/documents';
import { useAssetStore } from '../store/assets';
import { Asset } from '../types';

const DOCUMENT_TYPES = ['Legal Document', 'Financial', 'Marketing', 'Technical', 'Other'];
const CATEGORIES = [
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
const CONFIDENTIALITY_LEVELS = ['Low', 'Medium', 'High'];
const DEPARTMENTS = ['Legal', 'Finance', 'Marketing', 'Risk Management', 'Compliance', 'ESG', 'Investment'];

interface UploadingDocument {
  file: File;
  metadata: {
    type: string;
    category: string;
    confidentiality: 'Low' | 'Medium' | 'High';
    department: string;
    documentType: string;
    tags: string[];
  };
  assetId?: string;
  assetName?: string;
}

interface Props {
  onUpload: (documents: Omit<Document, 'id' | 'uploadedAt'>[]) => Promise<void>;
  onCancel: () => void;
  preselectedAsset?: Asset;
}

export default function DocumentUpload({ onUpload, onCancel, preselectedAsset }: Props) {
  const [uploadingDocuments, setUploadingDocuments] = useState<UploadingDocument[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const { assets } = useAssetStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newDocuments = acceptedFiles.map(file => ({
      file,
      metadata: {
        type: 'Other',
        category: 'Contracts',
        confidentiality: 'Medium' as const,
        department: 'Legal',
        documentType: '',
        tags: []
      },
      assetId: preselectedAsset?.id,
      assetName: preselectedAsset?.name
    }));
    setUploadingDocuments(prev => [...prev, ...newDocuments]);
  }, [preselectedAsset]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/csv': ['.csv']
    }
  });

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'Financial':
        return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />;
      case 'Legal Document':
        return <FileCheck className="h-5 w-5 text-blue-500" />;
      case 'Marketing':
        return <FileImage className="h-5 w-5 text-purple-500" />;
      case 'Technical':
        return <FileCog className="h-5 w-5 text-gray-500" />;
      default:
        return <FileWarning className="h-5 w-5 text-yellow-500" />;
    }
  };

  const handleMetadataChange = (index: number, field: string, value: string) => {
    setUploadingDocuments(prev => prev.map((doc, i) => {
      if (i === index) {
        return {
          ...doc,
          metadata: {
            ...doc.metadata,
            [field]: value
          }
        };
      }
      return doc;
    }));
  };

  const handleAssetChange = (index: number, assetId: string) => {
    const selectedAsset = assets.find(asset => asset.id === assetId);
    setUploadingDocuments(prev => prev.map((doc, i) => {
      if (i === index) {
        return {
          ...doc,
          assetId: assetId || undefined,
          assetName: selectedAsset?.name
        };
      }
      return doc;
    }));
  };

  const handleAddTag = (index: number, tag: string) => {
    if (!tag.trim()) return;
    setUploadingDocuments(prev => prev.map((doc, i) => {
      if (i === index && !doc.metadata.tags.includes(tag)) {
        return {
          ...doc,
          metadata: {
            ...doc.metadata,
            tags: [...doc.metadata.tags, tag]
          }
        };
      }
      return doc;
    }));
    setCurrentTag('');
  };

  const handleRemoveTag = (index: number, tagToRemove: string) => {
    setUploadingDocuments(prev => prev.map((doc, i) => {
      if (i === index) {
        return {
          ...doc,
          metadata: {
            ...doc.metadata,
            tags: doc.metadata.tags.filter(tag => tag !== tagToRemove)
          }
        };
      }
      return doc;
    }));
  };

  const handleRemoveDocument = (index: number) => {
    setUploadingDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const documents = uploadingDocuments.map(doc => ({
      name: doc.file.name,
      type: doc.metadata.type,
      category: doc.metadata.category,
      size: Number((doc.file.size / (1024 * 1024)).toFixed(2)), // Convert to MB
      lastModified: new Date().toISOString(),
      status: 'active' as const,
      uploadedBy: 'Current User', // Replace with actual user
      version: '1.0',
      tags: doc.metadata.tags,
      assetId: doc.assetId,
      assetName: doc.assetName,
      thumbnail: 'https://images.unsplash.com/photo-1568695269828-8da695a95ea5?w=800&h=600&fit=crop',
      metadata: {
        documentType: doc.metadata.documentType,
        confidentiality: doc.metadata.confidentiality,
        department: doc.metadata.department,
        reviewStatus: 'Pending'
      },
      versions: [
        {
          version: '1.0',
          date: new Date().toISOString(),
          author: 'Current User', // Replace with actual user
          changes: 'Initial version'
        }
      ]
    }));

    await onUpload(documents);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl m-4">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Upload Documents</h2>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Dropzone */}
            {uploadingDocuments.length === 0 && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop documents here, or click to select files
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: PDF, DOCX, XLSX, CSV
                </p>
              </div>
            )}

            {/* Document List */}
            {uploadingDocuments.length > 0 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Selected Documents ({uploadingDocuments.length})
                  </h3>
                  <button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.multiple = true;
                      input.accept = '.pdf,.docx,.xlsx,.csv';
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files) onDrop(Array.from(files));
                      };
                      input.click();
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Add More Files
                  </button>
                </div>

                <div className="space-y-4">
                  {uploadingDocuments.map((doc, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {getDocumentIcon(doc.metadata.type)}
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {doc.file.name}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({(doc.file.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveDocument(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Document Type
                          </label>
                          <select
                            value={doc.metadata.type}
                            onChange={(e) => handleMetadataChange(index, 'type', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            {DOCUMENT_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            value={doc.metadata.category}
                            onChange={(e) => handleMetadataChange(index, 'category', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            {CATEGORIES.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Confidentiality
                          </label>
                          <select
                            value={doc.metadata.confidentiality}
                            onChange={(e) => handleMetadataChange(index, 'confidentiality', e.target.value as 'Low' | 'Medium' | 'High')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            {CONFIDENTIALITY_LEVELS.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Department
                          </label>
                          <select
                            value={doc.metadata.department}
                            onChange={(e) => handleMetadataChange(index, 'department', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            {DEPARTMENTS.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Document Type Description
                          </label>
                          <input
                            type="text"
                            value={doc.metadata.documentType}
                            onChange={(e) => handleMetadataChange(index, 'documentType', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="e.g., Annual Report"
                          />
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            <Link2 className="h-4 w-4 mr-1" />
                            Linked Asset
                          </label>
                          {preselectedAsset ? (
                            <div className="mt-1 block w-full px-3 py-2 bg-gray-100 rounded-md border border-gray-300 text-gray-500 sm:text-sm">
                              {preselectedAsset.name}
                            </div>
                          ) : (
                            <select
                              value={doc.assetId || ''}
                              onChange={(e) => handleAssetChange(index, e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value="">Select Asset</option>
                              {assets.map(asset => (
                                <option key={asset.id} value={asset.id}>{asset.name}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div className="lg:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Tags
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              value={currentTag}
                              onChange={(e) => setCurrentTag(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ',') {
                                  e.preventDefault();
                                  handleAddTag(index, currentTag);
                                }
                              }}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="Add tags (press Enter or comma to add)"
                            />
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {doc.metadata.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(index, tag)}
                                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploadingDocuments.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                Upload Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}