import { Store, DollarSign, Clock, Shield } from 'lucide-react';

const TRADING_HOURS = [
  { day: 'Monday', start: '09:00', end: '17:00' },
  { day: 'Tuesday', start: '09:00', end: '17:00' },
  { day: 'Wednesday', start: '09:00', end: '17:00' },
  { day: 'Thursday', start: '09:00', end: '17:00' },
  { day: 'Friday', start: '09:00', end: '17:00' },
  { day: 'Saturday', start: 'Closed', end: 'Closed' },
  { day: 'Sunday', start: 'Closed', end: 'Closed' }
];

const TRANSACTION_LIMITS = [
  { id: 1, name: 'Minimum Investment', value: '$5,000', icon: DollarSign },
  { id: 2, name: 'Maximum Investment', value: '$1,000,000', icon: DollarSign },
  { id: 3, name: 'Daily Transaction Limit', value: '$500,000', icon: Clock }
];

const COMPLIANCE_SETTINGS = [
  { id: 1, name: 'KYC Verification', enabled: true, mandatory: true },
  { id: 2, name: 'AML Screening', enabled: true, mandatory: true },
  { id: 3, name: 'Accredited Investor Check', enabled: true, mandatory: false },
  { id: 4, name: 'Risk Assessment', enabled: true, mandatory: true }
];

export default function MarketplaceSettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Marketplace Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure trading hours, transaction limits, and compliance settings
        </p>
      </div>

      {/* Trading Hours */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Trading Hours</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Edit Hours
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {TRADING_HOURS.map((schedule) => (
              <li key={schedule.day}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div className="flex items-center">
                    <Store className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{schedule.day}</div>
                      <div className="text-sm text-gray-500">
                        {schedule.start} - {schedule.end}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transaction Limits */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Transaction Limits</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Edit Limits
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {TRANSACTION_LIMITS.map((limit) => {
              const Icon = limit.icon;
              return (
                <li key={limit.id}>
                  <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{limit.name}</div>
                        <div className="text-sm text-gray-500">{limit.value}</div>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Compliance Settings */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Compliance Settings</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Edit Settings
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {COMPLIANCE_SETTINGS.map((setting) => (
              <li key={setting.id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{setting.name}</div>
                      <div className="text-sm text-gray-500">
                        {setting.enabled ? 'Enabled' : 'Disabled'} •
                        {setting.mandatory ? ' Mandatory' : ' Optional'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={setting.enabled}
                        onChange={() => { }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Configure
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}