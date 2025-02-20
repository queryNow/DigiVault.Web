import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  Calendar,
  PieChart,
  BarChart,
  AlertTriangle,
  Building2,
  Briefcase,
  Clock,
  Download
} from 'lucide-react';

interface FinancialTabProps {
  totalAssetValue: number;
  averageReturn: number;
  activeAssets: number;
}

export default function FinancialTab({ totalAssetValue, averageReturn, activeAssets }: FinancialTabProps) {
  const [reportPeriod, setReportPeriod] = useState('q1-2024');
  const [reportType, setReportType] = useState('consolidated');

  // Mock financial data
  const financialMetrics = {
    revenue: 12500000,
    expenses: 4800000,
    profit: 7700000,
    profitMargin: 61.6,
    operatingCosts: 3200000,
    administrativeCosts: 1600000,
    cashFlow: 5500000,
    assets: {
      current: 8500000,
      fixed: 25000000,
      total: 33500000
    },
    liabilities: {
      current: 4200000,
      longTerm: 12000000,
      total: 16200000
    },
    equity: 17300000
  };

  const quarterlyTrends = [
    { quarter: 'Q1 2023', revenue: 10200000, expenses: 4200000, profit: 6000000 },
    { quarter: 'Q2 2023', revenue: 11000000, expenses: 4400000, profit: 6600000 },
    { quarter: 'Q3 2023', revenue: 11800000, expenses: 4600000, profit: 7200000 },
    { quarter: 'Q4 2023', revenue: 12200000, expenses: 4700000, profit: 7500000 },
    { quarter: 'Q1 2024', revenue: 12500000, expenses: 4800000, profit: 7700000 }
  ];

  const assetPerformance = [
    { type: 'Real Estate', value: 15000000, return: 12.5 },
    { type: 'Private Equity', value: 8500000, return: 18.2 },
    { type: 'Fixed Income', value: 6000000, return: 8.4 },
    { type: 'Infrastructure', value: 4000000, return: 10.1 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700">
                Reporting Period
              </label>
              <select
                id="period"
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="q1-2024">Q1 2024</option>
                <option value="q4-2023">Q4 2023</option>
                <option value="q3-2023">Q3 2023</option>
                <option value="q2-2023">Q2 2023</option>
                <option value="q1-2023">Q1 2023</option>
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Report Type
              </label>
              <select
                id="type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="consolidated">Consolidated</option>
                <option value="detailed">Detailed</option>
                <option value="summary">Summary</option>
              </select>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(financialMetrics.revenue)}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      8.2%
                    </div>
                  </dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Profit</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(financialMetrics.profit)}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      12.5%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PieChart className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Profit Margin</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {financialMetrics.profitMargin}%
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      2.3%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Operating Costs</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(financialMetrics.operatingCosts)}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      <ArrowUp className="h-4 w-4" />
                      5.1%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Performance Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Quarterly Performance</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <ArrowUp className="h-3 w-3 mr-1" />
                15.2% YoY Growth
              </span>
            </div>
          </div>
        </div>

        <div className="relative h-80">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
            <span>$15M</span>
            <span>$12M</span>
            <span>$9M</span>
            <span>$6M</span>
            <span>$3M</span>
            <span>$0</span>
          </div>

          {/* Chart Area */}
          <div className="ml-16 h-full">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-1 grid-rows-5 gap-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="border-t border-gray-200 w-full"
                />
              ))}
            </div>

            {/* Bars */}
            <div className="relative h-full flex items-end justify-between px-2">
              {quarterlyTrends.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      <div>Revenue: {formatCurrency(data.revenue)}</div>
                      <div>Expenses: {formatCurrency(data.expenses)}</div>
                      <div>Profit: {formatCurrency(data.profit)}</div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent border-t-gray-900"></div>
                  </div>

                  {/* Stacked Bars */}
                  <div className="relative flex justify-center space-x-1 w-full">
                    {/* Revenue Bar */}
                    <div className="w-8">
                      <div
                        className="bg-indigo-500 rounded-t transition-all duration-300 ease-in-out hover:opacity-80"
                        style={{ 
                          height: `${(data.revenue / 15000000) * 320}px`,
                          minHeight: '4px'
                        }}
                      />
                    </div>
                    {/* Profit Bar */}
                    <div className="w-8">
                      <div
                        className="bg-green-500 rounded-t transition-all duration-300 ease-in-out hover:opacity-80"
                        style={{ 
                          height: `${(data.profit / 15000000) * 320}px`,
                          minHeight: '4px'
                        }}
                      />
                    </div>
                  </div>
                  <span className="mt-2 text-xs text-gray-500">{data.quarter}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2" />
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <span className="text-sm text-gray-600">Profit</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Updated 5 mins ago
          </div>
        </div>
      </div>

      {/* Balance Sheet Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Balance Sheet Summary</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Assets</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Assets</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(financialMetrics.assets.current)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fixed Assets</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(financialMetrics.assets.fixed)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-900">Total Assets</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(financialMetrics.assets.total)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Liabilities</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Liabilities</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(financialMetrics.liabilities.current)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Long-term Liabilities</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(financialMetrics.liabilities.longTerm)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-900">Total Liabilities</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(financialMetrics.liabilities.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900">Total Equity</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(financialMetrics.equity)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Performance */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Performance</h3>
          <div className="space-y-4">
            {assetPerformance.map((asset) => (
              <div key={asset.type} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{asset.type}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(asset.value)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    asset.return >= 15 ? 'bg-green-100 text-green-800' :
                    asset.return >= 10 ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {asset.return}% ROI
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}