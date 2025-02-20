import { useState } from 'react';
import {
  FileText,
  Building2,
  DollarSign,
  AlertTriangle,
  Users,
  Calendar,
  Search,
  Clock,
  Shield
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'asset' | 'document' | 'investment' | 'compliance' | 'user';
  action: string;
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
  };
  metadata?: {
    assetName?: string;
    documentName?: string;
    amount?: number;
    status?: string;
  };
}

const ACTIVITY_TYPES = [
  'All Types',
  'Asset',
  'Document',
  'Investment',
  'Compliance',
  'User'
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'asset',
    action: 'created',
    title: 'New Asset Listed',
    description: 'Commercial Property A has been listed on the marketplace',
    timestamp: '2024-03-20T10:30:00Z',
    user: {
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&auto=format'
    },
    metadata: {
      assetName: 'Commercial Property A'
    }
  },
  {
    id: '2',
    type: 'document',
    action: 'uploaded',
    title: 'Document Uploaded',
    description: 'Q1 2024 Financial Report has been added to DocuVault',
    timestamp: '2024-03-19T15:45:00Z',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&auto=format'
    },
    metadata: {
      documentName: 'Q1 2024 Financial Report.pdf'
    }
  },
  {
    id: '3',
    type: 'investment',
    action: 'completed',
    title: 'Investment Completed',
    description: 'New investment of $500,000 in Tech Startup Portfolio',
    timestamp: '2024-03-18T09:15:00Z',
    user: {
      name: 'Michael Chen'
    },
    metadata: {
      assetName: 'Tech Startup Portfolio',
      amount: 500000
    }
  },
  {
    id: '4',
    type: 'compliance',
    action: 'alert',
    title: 'Compliance Alert',
    description: 'New regulatory requirements need attention',
    timestamp: '2024-03-17T14:20:00Z',
    user: {
      name: 'Emma Wilson'
    },
    metadata: {
      status: 'Pending Review'
    }
  },
  {
    id: '5',
    type: 'user',
    action: 'joined',
    title: 'New Investor Onboarded',
    description: 'John Smith completed KYC verification',
    timestamp: '2024-03-16T11:30:00Z',
    user: {
      name: 'Admin System'
    }
  }
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'asset':
      return Building2;
    case 'document':
      return FileText;
    case 'investment':
      return DollarSign;
    case 'compliance':
      return Shield;
    case 'user':
      return Users;
    default:
      return AlertTriangle;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'asset':
      return 'text-blue-500 bg-blue-100';
    case 'document':
      return 'text-green-500 bg-green-100';
    case 'investment':
      return 'text-purple-500 bg-purple-100';
    case 'compliance':
      return 'text-yellow-500 bg-yellow-100';
    case 'user':
      return 'text-indigo-500 bg-indigo-100';
    default:
      return 'text-gray-500 bg-gray-100';
  }
};

const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export default function Activity() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [sortBy, setSortBy] = useState('newest');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Filter and sort activities
  const filteredActivities = MOCK_ACTIVITIES
    .filter(activity => {
      const matchesSearch =
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === 'All Types' ||
        activity.type.toLowerCase() === selectedType.toLowerCase();

      const matchesDateFrom = !dateRange.from ||
        new Date(activity.timestamp) >= new Date(dateRange.from);

      const matchesDateTo = !dateRange.to ||
        new Date(activity.timestamp) <= new Date(dateRange.to);

      return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track all activities and changes across your platform
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search activities..."
            />
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {ACTIVITY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul role="list" className="divide-y divide-gray-200">
          {filteredActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);

            return (
              <li key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  <div className={`rounded-lg p-2 ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          {formatRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex items-center">
                        {activity.user.avatar ? (
                          <img
                            className="h-6 w-6 rounded-full"
                            src={activity.user.avatar}
                            alt={activity.user.name}
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                        <span className="ml-2 text-sm text-gray-500">{activity.user.name}</span>
                      </div>
                      {activity.metadata && (
                        <div className="flex items-center space-x-4">
                          {activity.metadata.assetName && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Building2 className="h-3 w-3 mr-1" />
                              {activity.metadata.assetName}
                            </span>
                          )}
                          {activity.metadata.documentName && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FileText className="h-3 w-3 mr-1" />
                              {activity.metadata.documentName}
                            </span>
                          )}
                          {activity.metadata.amount && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <DollarSign className="h-3 w-3 mr-1" />
                              ${activity.metadata.amount.toLocaleString()}
                            </span>
                          )}
                          {activity.metadata.status && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {activity.metadata.status}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}