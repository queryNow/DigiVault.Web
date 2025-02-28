import React from 'react';
import { BarChart, PieChart, LineChart, Settings, Download, Mail } from 'lucide-react';

const REPORT_TYPES = [
  { id: 1, name: 'Asset Performance Report', icon: BarChart, frequency: 'Monthly', recipients: 15 },
  { id: 2, name: 'Investment Analytics', icon: LineChart, frequency: 'Weekly', recipients: 8 },
  { id: 3, name: 'Financial Statements', icon: PieChart, frequency: 'Quarterly', recipients: 12 },
  { id: 4, name: 'Compliance Reports', icon: Settings, frequency: 'Monthly', recipients: 10 }
];

const EXPORT_FORMATS = [
  { id: 1, name: 'PDF Export', enabled: true, default: true },
  { id: 2, name: 'Excel Export', enabled: true, default: false },
  { id: 3, name: 'CSV Export', enabled: true, default: false },
  { id: 4, name: 'JSON Export', enabled: false, default: false }
];

const SCHEDULING_OPTIONS = [
  { id: 1, name: 'End of Day', time: '18:00', enabled: true },
  { id: 2, name: 'Week Summary', day: 'Friday', time: '17:00', enabled: true },
  { id: 3, name: 'Month End', day: 'Last Day', time: '23:59', enabled: true },
  { id: 4, name: 'Quarter End', day: 'Last Day', time: '23:59', enabled: true }
];

export default function ReportsSettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Reports Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure automated reports, export formats, and scheduling options
        </p>
      </div>

      {/* Report Types */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Report Types</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Add Report Type
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {REPORT_TYPES.map((report) => {
              const Icon = report.icon;
              return (
                <li key={report.id}>
                  <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        <div className="text-sm text-gray-500">
                          {report.frequency} • {report.recipients} recipients
                        </div>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Configure
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Export Settings */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Export Settings</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Add Format
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {EXPORT_FORMATS.map((format) => (
              <li key={format.id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div className="flex items-center">
                    <Download className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{format.name}</div>
                      <div className="text-sm text-gray-500">
                        {format.default ? 'Default format' : 'Optional format'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={format.enabled}
                        onChange={() => {}}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-500">Enabled</span>
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

      {/* Scheduling */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Report Scheduling</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Add Schedule
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {SCHEDULING_OPTIONS.map((schedule) => (
              <li key={schedule.id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{schedule.name}</div>
                      <div className="text-sm text-gray-500">
                        {schedule.day ? `${schedule.day} at ${schedule.time}` : `Daily at ${schedule.time}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={() => {}}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-500">Enabled</span>
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

      {/* Email Settings */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Add Template
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            <li>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Report Delivery Template</div>
                    <div className="text-sm text-gray-500">
                      Template used for automated report delivery
                    </div>
                  </div>
                </div>
                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  Edit Template
                </button>
              </div>
            </li>
            <li>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Report Error Notification</div>
                    <div className="text-sm text-gray-500">
                      Template for report generation error notifications
                    </div>
                  </div>
                </div>
                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  Edit Template
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}