import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, TrendingUp, Clock, AlertTriangle, Tag } from 'lucide-react';
import { Asset } from '../../types';

interface Props {
  asset: Asset;
}

export default function AssetCard({ asset }: Props) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg transition duration-150 hover:shadow-lg">
      <div className="relative">
        <img
          src={asset.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'}
          alt={asset.name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            asset.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
            asset.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            {asset.riskLevel} Risk
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center">
          <Building2 className="h-5 w-5 text-gray-400" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">{asset.name}</h3>
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {asset.location}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <Tag className="h-4 w-4 text-gray-400" />
            <span className="ml-1 text-sm text-gray-500">{asset.type}</span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {asset.assetClass}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Expected Return</p>
            <div className="mt-1 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="ml-1 text-lg font-semibold text-gray-900">{asset.expectedReturn}%</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Investment Term</p>
            <div className="mt-1 flex items-center">
              <Clock className="h-4 w-4 text-blue-500" />
              <p className="ml-1 text-lg font-semibold text-gray-900">{asset.investmentTerm}m</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">${asset.value.toLocaleString()}</span>
            <span className="text-sm text-gray-500">Min: ${Number(asset.minimumInvestment).toLocaleString()}</span>
          </div>
          <Link
            to={`/marketplace/${asset.id}`}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}