import React from 'react';

const AssetsPage: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Asset Management</h1>
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Digital Assets</h3>
              <p className="text-sm text-gray-600 mt-1">Manage your digital assets and files</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Asset Categories</h3>
              <p className="text-sm text-gray-600 mt-1">Organize and categorize your assets</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Asset Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">View asset usage and statistics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsPage;