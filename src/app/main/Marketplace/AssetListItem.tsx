import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, TrendingUp, Clock, AlertTriangle, DollarSign, Users, Tag } from 'lucide-react';
import { Asset } from '../../types';

interface Props {
  asset: Asset;
}

export default function AssetListItem({ asset }: Props) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="flex">
        {/* Image */}
        <div className="flex-shrink-0 w-48">
          <img
            src={asset.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'}
            alt={asset.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between">
            <div>
              <Link to={`/marketplace/${asset.id}`} className="text-lg font-medium text-indigo-600 hover:text-indigo-900">
                {asset.name}
              </Link>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {asset.location}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">${asset.value.toLocaleString()}</div>
              <div className="mt-1 text-sm text-gray-500">Total Value</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900">{asset.expectedReturn}%</div>
                <div className="text-xs text-gray-500">Expected Return</div>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900">{asset.investmentTerm}m</div>
                <div className="text-xs text-gray-500">Investment Term</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                asset.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                asset.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                {asset.riskLevel} Risk
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Tag className="h-3 w-3 mr-1" />
                {asset.type}
              </span>
            </div>
            <Link
              to={`/marketplace/${asset.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}