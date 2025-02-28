import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ReviewProps {
  formData: any;
}

export default function Review({ formData }: ReviewProps) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border border-amber-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              Please review all information carefully before submitting. This information will be used for asset tokenization and marketplace listing.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Asset Class</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.assetClass}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.description}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Investment Details</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Target Value</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formData.currency} {formData.targetValue}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Minimum Investment</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formData.currency} {formData.minimumInvestment}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Expected Return</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.expectedReturn}%</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Investment Term</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.investmentTerm} months</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Documents ({formData.documents.length})
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {formData.documents.map((doc: any) => (
                <li key={doc.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {doc.name}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {doc.size.toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}