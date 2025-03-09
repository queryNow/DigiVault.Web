import React from 'react';

const DocumentsPage: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Document Center</h1>
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Recent Documents</h3>
              <p className="text-sm text-gray-600 mt-1">Access your recently viewed documents</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Shared Documents</h3>
              <p className="text-sm text-gray-600 mt-1">View documents shared with you</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Document Templates</h3>
              <p className="text-sm text-gray-600 mt-1">Access standard document templates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;