import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart2, LineChart, FileBox, Files } from 'lucide-react';

const Analytics: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'usage' | 'details' | 'assets' | 'documents'>('usage');

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    switch (path) {
      case 'details':
        setActiveTab('details');
        break;
      case 'apps':
        setActiveTab('assets');
        break;
      case 'workspaces':
        setActiveTab('documents');
        break;
      default:
        setActiveTab('usage');
    }
  }, [location]);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    const path = tab === 'usage' ? 'usage' :
                tab === 'details' ? 'details' :
                tab === 'assets' ? 'apps' :
                'workspaces';
    navigate(`/analytics/${path}`);
  };

  const getIcon = () => {
    switch (activeTab) {
      case 'details':
        return <LineChart className="h-8 w-8 text-indigo-600" />;
      case 'assets':
        return <FileBox className="h-8 w-8 text-indigo-600" />;
      case 'documents':
        return <Files className="h-8 w-8 text-indigo-600" />;
      default:
        return <BarChart2 className="h-8 w-8 text-indigo-600" />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'details':
        return 'Detailed Analytics';
      case 'assets':
        return 'Asset Analytics';
      case 'documents':
        return 'Document Analytics';
      default:
        return 'Usage Analytics';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-3">
        {getIcon()}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getTitle()}</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => handleTabChange('usage')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'usage'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Usage
            </button>
            <button
              onClick={() => handleTabChange('details')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'details'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => handleTabChange('assets')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'assets'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => handleTabChange('documents')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'documents'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Documents
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'usage' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Track and analyze platform usage metrics.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">User Activity</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Monitor user engagement and activity
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">System Usage</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Track system resource utilization
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                View detailed analytics and reports.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Performance Metrics</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Analyze system performance data
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Custom Reports</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Generate customized analytics reports
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'assets' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Monitor asset usage and performance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Asset Usage</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Track asset utilization patterns
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Storage Analytics</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Monitor storage usage and trends
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Analyze document management metrics.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Document Activity</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Track document access and modifications
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Version History</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Monitor document versioning metrics
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;