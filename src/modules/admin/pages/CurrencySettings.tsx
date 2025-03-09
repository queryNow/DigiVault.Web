import React from 'react';
import { Coins } from 'lucide-react';

const CurrencySettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-3">
        <Coins className="h-8 w-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Currency Settings</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Currency Management</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configure and manage supported currencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white">Supported Currencies</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage available currency options
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white">Exchange Rates</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Configure currency exchange rates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencySettings;