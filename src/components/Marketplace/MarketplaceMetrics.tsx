import React from 'react';
import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import { Asset } from '../../types';

interface Props {
  assets: Asset[];
}

export default function MarketplaceMetrics({ assets }: Props) {
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const averageReturn = assets.reduce((sum, asset) => sum + Number(asset.expectedReturn), 0) / assets.length;
  const totalInvestors = assets.length * 15; // Simulated investor count
  const averageInvestmentTerm = assets.reduce((sum, asset) => sum + Number(asset.investmentTerm), 0) / assets.length;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Asset Value</dt>
                <dd className="text-lg font-medium text-gray-900">${totalValue.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Average Return</dt>
                <dd className="text-lg font-medium text-gray-900">{averageReturn.toFixed(1)}%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Investors</dt>
                <dd className="text-lg font-medium text-gray-900">{totalInvestors.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Avg Investment Term</dt>
                <dd className="text-lg font-medium text-gray-900">{averageInvestmentTerm.toFixed(1)} months</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}