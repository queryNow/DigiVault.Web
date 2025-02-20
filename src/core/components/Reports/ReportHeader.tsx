import React from 'react';
import { Calendar, Filter } from 'lucide-react';

interface TimeRange {
  id: string;
  name: string;
}

interface ReportHeaderProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  timeRanges: TimeRange[];
}

export default function ReportHeader({ timeRange, onTimeRangeChange, timeRanges }: ReportHeaderProps) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Comprehensive analytics and reports for your platform.
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {timeRanges.map(range => (
              <option key={range.id} value={range.id}>{range.name}</option>
            ))}
          </select>
          <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>
    </>
  );
}