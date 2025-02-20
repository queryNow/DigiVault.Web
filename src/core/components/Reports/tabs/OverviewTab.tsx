import {
  Users,
  Building2,
  FileText,
  ArrowUp,
  ArrowDown,
  Globe,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssetStore } from '../../../../utils/store/assets';
import { useDocumentStore } from '../../../../utils/store/documents';

export default function OverviewTab() {
  const navigate = useNavigate();
  const { assets } = useAssetStore();
  const { documents } = useDocumentStore();

  // Calculate key metrics
  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const activeAssets = assets.filter(asset => asset.status === 'published').length;
  const averageReturn = assets.reduce((sum, asset) => sum + Number(asset.expectedReturn), 0) / assets.length;
  const totalDocuments = documents.length;

  // Format numbers for display
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

  // Mock performance data
  const performanceTrends = [
    { month: 'Jan', value: 12500000, returns: 8.2 },
    { month: 'Feb', value: 13200000, returns: 8.5 },
    { month: 'Mar', value: 14100000, returns: 8.8 },
    { month: 'Apr', value: 14800000, returns: 9.1 },
    { month: 'May', value: 15500000, returns: 9.4 },
    { month: 'Jun', value: 16200000, returns: 9.7 }
  ];

  // Quick insights with updated navigation
  const quickInsights = [
    {
      title: 'Asset Performance',
      metrics: [
        { label: 'Total Value', value: formatCurrency(totalAssetValue), change: 12.5, trend: 'up' },
        { label: 'Average Return', value: `${formatPercentage(averageReturn)}%`, change: 2.3, trend: 'up' },
        { label: 'Active Assets', value: activeAssets.toString(), change: 15, trend: 'up' }
      ],
      icon: Building2,
      color: 'bg-blue-500',
      onClick: () => navigate('/reports', { state: { tab: 'assets' } })
    },
    {
      title: 'Investment Activity',
      metrics: [
        { label: 'Total Investors', value: '156', change: 8.7, trend: 'up' },
        { label: 'New Investments', value: formatCurrency(2500000), change: 15.3, trend: 'up' },
        { label: 'Average Investment', value: formatCurrency(180000), change: -5.2, trend: 'down' }
      ],
      icon: Users,
      color: 'bg-green-500',
      onClick: () => navigate('/reports', { state: { tab: 'investors' } })
    },
    {
      title: 'Document Analytics',
      metrics: [
        { label: 'Total Documents', value: totalDocuments.toString(), change: 12.8, trend: 'up' },
        { label: 'Recent Uploads', value: '45', change: 23.5, trend: 'up' },
        { label: 'Storage Used', value: '256 GB', change: 18.2, trend: 'up' }
      ],
      icon: FileText,
      color: 'bg-purple-500',
      onClick: () => navigate('/reports', { state: { tab: 'documents' } })
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`${insight.color} bg-opacity-10 rounded-lg p-3`}>
                      <Icon className={`h-6 w-6 ${insight.color} text-opacity-100`} />
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">{insight.title}</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {insight.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{metric.label}</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{metric.value}</span>
                        <div className={`ml-2 flex items-center text-xs font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {metric.trend === 'up' ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )}
                          {metric.change}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={insight.onClick}
                  className="mt-6 flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                >
                  View detailed report
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Overview */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Performance Overview</h3>
            <select className="text-sm border-gray-300 rounded-md">
              <option value="6m">Last 6 months</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>

          <div className="relative h-80">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
              {[...Array(6)].map((_, i) => (
                <span key={i} className="text-right pr-2">
                  ${((20 - i * 4)).toFixed(1)}M
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

              {/* SVG for line charts */}
              <svg className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(79, 70, 229)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="rgb(79, 70, 229)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="returnsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Generate paths for each metric */}
                {performanceTrends.map((data, index, array) => {
                  if (index === 0) return null;

                  const prevData = array[index - 1];
                  const width = 100 / (array.length - 1);
                  const x1 = width * (index - 1);
                  const x2 = width * index;

                  // Calculate y coordinates (inverted because SVG coordinates)
                  const y1Value = 100 - ((prevData.value / 20000000) * 100);
                  const y2Value = 100 - ((data.value / 20000000) * 100);
                  const y1Returns = 100 - ((prevData.returns / 12) * 100);
                  const y2Returns = 100 - ((data.returns / 12) * 100);

                  return (
                    <g key={index}>
                      {/* Value line */}
                      <path
                        d={`M ${x1},${y1Value} L ${x2},${y2Value}`}
                        stroke="rgb(79, 70, 229)"
                        strokeWidth="2"
                        fill="none"
                        className="transition-all duration-300"
                      />

                      {/* Returns line */}
                      <path
                        d={`M ${x1},${y1Returns} L ${x2},${y2Returns}`}
                        stroke="rgb(34, 197, 94)"
                        strokeWidth="2"
                        fill="none"
                        className="transition-all duration-300"
                      />

                      {/* Data points */}
                      <circle
                        cx={x2}
                        cy={y2Value}
                        r="4"
                        fill="white"
                        stroke="rgb(79, 70, 229)"
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                      <circle
                        cx={x2}
                        cy={y2Returns}
                        r="4"
                        fill="white"
                        stroke="rgb(34, 197, 94)"
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />

                      {/* Tooltips */}
                      <g className="opacity-0 hover:opacity-100 transition-opacity">
                        <rect
                          x={x2 - 40}
                          y={Math.min(y2Value, y2Returns) - 40}
                          width="80"
                          height="30"
                          rx="4"
                          fill="rgb(17, 24, 39)"
                          fillOpacity="0.9"
                        />
                        <text
                          x={x2}
                          y={Math.min(y2Value, y2Returns) - 25}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                        >
                          <tspan x={x2} dy="0">Value: {formatCurrency(data.value)}</tspan>
                          <tspan x={x2} dy="15">Returns: {data.returns}%</tspan>
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                {performanceTrends.map((data, index) => (
                  <span key={index} className="text-xs text-gray-500">{data.month}</span>
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
      </div>

      {/* Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Distribution</h3>
          <div className="space-y-4">
            {['Low', 'Medium', 'High'].map((risk) => {
              const percentage = risk === 'Low' ? 35 : risk === 'Medium' ? 45 : 20;
              return (
                <div key={risk} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{risk} Risk</span>
                      <span className="text-sm text-gray-500">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${risk === 'Low' ? 'bg-green-500' :
                          risk === 'Medium' ? 'bg-yellow-500' :
                            'bg-red-500'
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

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Geographic Distribution</h3>
          <div className="space-y-4">
            {[
              { region: 'North America', value: 45 },
              { region: 'Europe', value: 30 },
              { region: 'Asia Pacific', value: 15 },
              { region: 'Other', value: 10 }
            ].map((item) => (
              <div key={item.region} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">{item.region}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-4">{item.value}%</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Class Distribution</h3>
          <div className="space-y-4">
            {[
              { type: 'Real Estate', value: 40 },
              { type: 'Private Equity', value: 25 },
              { type: 'Fixed Income', value: 20 },
              { type: 'Infrastructure', value: 15 }
            ].map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">{item.type}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-4">{item.value}%</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}