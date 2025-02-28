import { useEffect } from 'react';
import { FileText, Upload, Eye, RefreshCw, Archive, Shield, ArrowUp, Loader2 } from 'lucide-react';
import { useDocumentStore } from '../../../../utils/store/documents';
import { useAnalyticsStore } from '../../../../utils/store/analytics';


export default function DocumentsTab() {
  const { documents, loading: documentsLoading } = useDocumentStore();
  const { documentAnalytics, loading: analyticsLoading, calculateDocumentAnalytics } = useAnalyticsStore();

  useEffect(() => {
    // Calculate analytics when documents are available
    if (documents.length > 0) {
      calculateDocumentAnalytics(documents);
    }
  }, [documents, calculateDocumentAnalytics]);

  // Show loading state while data is being fetched
  if (documentsLoading || analyticsLoading || !documentAnalytics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-sm text-gray-500">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Format size for display
  const formatSize = (size: number) => {
    if (size < 1024) return `${size.toFixed(2)} MB`;
    return `${(size / 1024).toFixed(2)} GB`;
  };

  // Get color class for confidentiality level
  const getConfidentialityColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Documents</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{documentAnalytics.documentCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Archive className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Storage Used</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{formatSize(documentAnalytics.totalSize)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Recent Uploads</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{documentAnalytics.recentActivity.uploads}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Recent Views</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{documentAnalytics.recentActivity.views}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Document Categories</h3>
          <div className="space-y-4">
            {Object.entries(documentAnalytics.byCategory).map(([category, count]) => (
              <div key={category} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm text-gray-500">{count} documents</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${(count / documentAnalytics.documentCount) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confidentiality Levels */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Confidentiality Levels</h3>
          <div className="space-y-4">
            {Object.entries(documentAnalytics.byConfidentiality).map(([level, count]) => (
              <div key={level} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className={`h-5 w-5 mr-2 ${getConfidentialityColor(level)}`} />
                  <span className="text-sm font-medium text-gray-700">{level}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-4">{count} documents</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidentialityColor(level)}`}>
                    {((count / documentAnalytics.documentCount) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Trends Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Document Activity Trends</h3>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <ArrowUp className="h-3 w-3 mr-1" />
                23% vs last period
              </span>
            </div>
            <select className="text-sm border-gray-300 rounded-md">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative h-[400px]">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-500">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-right pr-2">
                {(100 - i * 20).toString()}
              </span>
            ))}
          </div>

          {/* Chart Area */}
          <div className="absolute inset-0 ml-12 mr-6 mb-8">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-gray-200"
                  style={{ top: `${(i * 100) / 5}%` }}
                />
              ))}
            </div>

            {/* SVG for line charts */}
            <svg className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="uploadsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="updatesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Generate paths for each metric */}
              {documentAnalytics.monthlyTrends.map((data, index, array) => {
                if (index === 0) return null;

                const prevData = array[index - 1];
                const width = 100 / (array.length - 1);
                const x1 = width * (index - 1);
                const x2 = width * index;

                // Calculate y coordinates (inverted because SVG coordinates)
                const y1Uploads = 100 - (prevData.uploads);
                const y2Uploads = 100 - (data.uploads);
                const y1Views = 100 - (prevData.views);
                const y2Views = 100 - (data.views);
                const y1Updates = 100 - (prevData.updates);
                const y2Updates = 100 - (data.updates);

                return (
                  <g key={index}>
                    {/* Uploads line */}
                    <path
                      d={`M ${x1},${y1Uploads} L ${x2},${y2Uploads}`}
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                      fill="none"
                      className="transition-all duration-300"
                    />

                    {/* Views line */}
                    <path
                      d={`M ${x1},${y1Views} L ${x2},${y2Views}`}
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="2"
                      fill="none"
                      className="transition-all duration-300"
                    />

                    {/* Updates line */}
                    <path
                      d={`M ${x1},${y1Updates} L ${x2},${y2Updates}`}
                      stroke="rgb(168, 85, 247)"
                      strokeWidth="2"
                      fill="none"
                      className="transition-all duration-300"
                    />

                    {/* Data points */}
                    <circle
                      cx={x2}
                      cy={y2Uploads}
                      r="4"
                      fill="white"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={x2}
                      cy={y2Views}
                      r="4"
                      fill="white"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={x2}
                      cy={y2Updates}
                      r="4"
                      fill="white"
                      stroke="rgb(168, 85, 247)"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />

                    {/* Tooltips */}
                    <g className="opacity-0 hover:opacity-100 transition-opacity">
                      <rect
                        x={x2 - 40}
                        y={Math.min(y2Uploads, y2Views, y2Updates) - 60}
                        width="80"
                        height="50"
                        rx="4"
                        fill="rgb(17, 24, 39)"
                        fillOpacity="0.9"
                      />
                      <text
                        x={x2}
                        y={Math.min(y2Uploads, y2Views, y2Updates) - 40}
                        textAnchor="middle"
                        fill="white"
                        fontSize="12"
                      >
                        <tspan x={x2} dy="0">Uploads: {data.uploads}</tspan>
                        <tspan x={x2} dy="15">Views: {data.views}</tspan>
                        <tspan x={x2} dy="15">Updates: {data.updates}</tspan>
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between">
              {documentAnalytics.monthlyTrends.map((data, index) => (
                <span key={index} className="text-xs text-gray-500">{data.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
              <div>
                <span className="text-sm text-gray-600">Uploads</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {documentAnalytics.recentActivity.uploads} total
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <div>
                <span className="text-sm text-gray-600">Views</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {documentAnalytics.recentActivity.views} total
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2" />
              <div>
                <span className="text-sm text-gray-600">Updates</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {documentAnalytics.recentActivity.updates} total
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center text-sm text-gray-500">
            <RefreshCw className="h-4 w-4 mr-1" />
            Last updated 5 mins ago
          </div>
        </div>
      </div>
    </div>
  );
}