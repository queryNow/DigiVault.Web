import React from 'react';
import { Tag } from 'lucide-react';

const ASSET_STATUS = ['Active', 'Pending', 'Under Review', 'Draft'];

interface BasicDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function BasicDetails({ formData, setFormData }: BasicDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Basic Details Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Identity</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Asset Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter a unique and descriptive name"
            />
          </div>

          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
              Short Description
            </label>
            <input
              type="text"
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Brief summary (max 160 characters)"
              maxLength={160}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Detailed Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Provide a comprehensive description of the asset"
            />
          </div>
        </div>
      </div>

      {/* Asset Configuration Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="assetStatus" className="block text-sm font-medium text-gray-700">
              Asset Status
            </label>
            <select
              id="assetStatus"
              value={formData.assetStatus}
              onChange={(e) => setFormData({ ...formData, assetStatus: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Status</option>
              {ASSET_STATUS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
              Visibility
            </label>
            <select
              id="visibility"
              value={formData.visibility}
              onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Add tags (comma separated)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  const input = e.currentTarget;
                  const value = input.value.trim();
                  if (value && !formData.tags.includes(value)) {
                    setFormData({
                      ...formData,
                      tags: [...formData.tags, value]
                    });
                    input.value = '';
                  }
                }
              }}
            />
          </div>
          {formData.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    type="button"
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        tags: formData.tags.filter((_: string, i: number) => i !== index)
                      });
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}