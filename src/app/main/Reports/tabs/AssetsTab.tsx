import {
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowUp,
  Globe,
  Activity
} from 'lucide-react';
import { useAssetStore } from '../../../../utils/store/assets';
import { Asset } from '../../../../utils/types';

export default function AssetsTab() {
  const { assets }: { assets: Asset[] } = useAssetStore();

  // Calculate asset metrics
  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const activeAssets = assets.filter(asset => asset.status === 'published').length;
  const averageReturn = assets.reduce((sum, asset) => sum + Number(asset.expectedReturn), 0) / assets.length;

  // Asset distribution by type
  const assetsByType = assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + asset.value;
    return acc;
  }, {} as Record<string, number>);

  // Asset distribution by region
  const assetsByRegion = assets.reduce((acc, asset) => {
    acc[asset.region] = (acc[asset.region] || 0) + asset.value;
    return acc;
  }, {} as Record<string, number>);

  // Risk distribution
  const assetsByRisk = assets.reduce((acc, asset) => {
    acc[asset.riskLevel] = (acc[asset.riskLevel] || 0) + asset.value;
    return acc;
  }, {} as Record<string, number>);

  // Mock performance data
  const performanceTrends = [
    { month: 'Jan', value: 12500000, returns: 8.2 },
    { month: 'Feb', value: 13200000, returns: 8.5 },
    { month: 'Mar', value: 14100000, returns: 8.8 },
    { month: 'Apr', value: 14800000, returns: 9.1 },
    { month: 'May', value: 15500000, returns: 9.4 },
    { month: 'Jun', value: 16200000, returns: 9.7 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  };

  // Calculate chart dimensions and scales
  const chartWidth = 100; // Percentage width
  const chartHeight = 320; // Fixed height in pixels
  const maxValue = Math.max(...performanceTrends.map(d => d.value));
  const minValue = Math.min(...performanceTrends.map(d => d.value));
  const valueRange = maxValue - minValue;

  // Calculate points for the line chart
  const points = performanceTrends.map((d, i) => {
    const x = (i / (performanceTrends.length - 1)) * chartWidth;
    const y = ((maxValue - d.value) / valueRange) * chartHeight;
    return `${x},${y}`;
  });

  // Create path commands for the area and line
  const areaPath = `
    M ${points[0]}
    L ${points.join(' L ')}
    L ${chartWidth},${chartHeight}
    L 0,${chartHeight}
    Z
  `;

  const linePath = `M ${points.join(' L ')}`;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
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
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(totalAssetValue)}
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
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Assets</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{activeAssets}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      3
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Return</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatPercentage(averageReturn)}%
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      1.2%
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
                <Activity className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Asset Utilization</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">92%</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      4.3%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Performance Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Asset Performance</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <ArrowUp className="h-3 w-3 mr-1" />
                15.2% YoY Growth
              </span>
            </div>
            <select className="text-sm border-gray-300 rounded-md">
              <option value="6m">Last 6 months</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        <div className="relative h-80">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
            {[...Array(6)].map((_, i) => (
              <span key={i}>
                ${((maxValue * (5 - i)) / 5 / 1000000).toFixed(1)}M
              </span>
            ))}
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

            {/* Chart SVG */}
            <div className="relative h-full">
              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(79, 70, 229)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="rgb(79, 70, 229)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Area */}
                <path
                  d={areaPath}
                  fill="url(#areaGradient)"
                  className="transition-all duration-300"
                />

                {/* Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="rgb(79, 70, 229)"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Data points */}
                {performanceTrends.map((d, i) => {
                  const x = (i / (performanceTrends.length - 1)) * chartWidth;
                  const y = ((maxValue - d.value) / valueRange) * chartHeight;
                  return (
                    <g key={i} className="transition-transform duration-300">
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="white"
                        stroke="rgb(79, 70, 229)"
                        strokeWidth="2"
                      />
                      {/* Tooltip */}
                      <g
                        className="opacity-0 hover:opacity-100 transition-opacity"
                        transform={`translate(${x},${y - 20})`}
                      >
                        <rect
                          x="-40"
                          y="-25"
                          width="80"
                          height="20"
                          rx="4"
                          fill="rgb(17, 24, 39)"
                          fillOpacity="0.9"
                        />
                        <text
                          x="0"
                          y="-12"
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                        >
                          {formatCurrency(d.value)}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between">
              {performanceTrends.map((d, i) => (
                <span key={i} className="text-xs text-gray-500">{d.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2" />
              <span className="text-sm text-gray-600">Asset Value</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <span className="text-sm text-gray-600">Returns</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Updated 5 mins ago
          </div>
        </div>
      </div>

      {/* Asset Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Type */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Distribution by Type</h3>
          <div className="space-y-4">
            {Object.entries(assetsByType).map(([type, value]) => (
              <div key={type} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                    <span className="text-sm text-gray-500">{formatCurrency(value)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${(value / totalAssetValue) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Region */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Geographic Distribution</h3>
          <div className="space-y-4">
            {Object.entries(assetsByRegion).map(([region, value]) => (
              <div key={region} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">{region}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-4">{formatCurrency(value)}</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {((value / totalAssetValue) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(assetsByRisk).map(([risk, value]) => {
            const percentage = (value / totalAssetValue) * 100;
            return (
              <div key={risk} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <AlertTriangle className={`h-5 w-5 mr-2 ${risk === 'High' ? 'text-red-500' :
                      risk === 'Medium' ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                    <span className="text-sm font-medium text-gray-700">{risk} Risk</span>
                  </div>
                  <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-semibold text-gray-900">{formatCurrency(value)}</div>
                  <div className="text-sm text-gray-500">Total Value</div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${risk === 'High' ? 'bg-red-500' :
                        risk === 'Medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}