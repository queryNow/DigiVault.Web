import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building2, 
  FileText, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Activity,
  ChevronRight,
  BarChart,
  PieChart,
  Calendar,
  Globe,
  Briefcase,
  Tag,
  Shield,
  Eye,
  Upload,
  Download,
  Loader2
} from 'lucide-react';
import { useAssetStore } from '../store/assets';
import { useDocumentStore } from '../store/documents';

// Helper function to format relative time
const getRelativeTime = (date: string) => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInWeeks > 0) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { assets, loading: assetsLoading, fetchAssets } = useAssetStore();
  const { documents, loading: documentsLoading, fetchDocuments } = useDocumentStore();

  // Load data when component mounts
  useEffect(() => {
    fetchAssets();
    fetchDocuments();
  }, [fetchAssets, fetchDocuments]);

  // Show loading state while data is being fetched
  if (assetsLoading || documentsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-sm text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics with safeguards
  const totalAssetValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
  const activeAssets = assets.filter(asset => asset.status === 'published').length;
  const totalInvestors = 156; // This would come from a real investors store
  const averageReturn = assets.length > 0 
    ? assets.reduce((sum, asset) => sum + (Number(asset.expectedReturn) || 0), 0) / assets.length
    : 0;

  // Recent activity with more varied timestamps
  const recentActivity = [
    {
      id: 1,
      type: 'asset',
      action: 'created',
      title: 'New Asset Listed',
      description: 'Commercial Property A has been listed on the marketplace',
      timestamp: '2024-03-20T10:30:00Z',
      icon: Building2,
      iconColor: 'text-blue-500',
      link: '/assets/1'
    },
    {
      id: 2,
      type: 'document',
      action: 'uploaded',
      title: 'Document Uploaded',
      description: 'Q1 2024 Financial Report has been added to DocuVault',
      timestamp: '2024-03-19T15:45:00Z',
      icon: FileText,
      iconColor: 'text-green-500',
      link: '/docuvault'
    },
    {
      id: 3,
      type: 'investment',
      action: 'completed',
      title: 'Investment Completed',
      description: 'New investment of $500,000 in Tech Startup Portfolio',
      timestamp: '2024-03-18T09:15:00Z',
      icon: DollarSign,
      iconColor: 'text-purple-500',
      link: '/assets/2'
    },
    {
      id: 4,
      type: 'compliance',
      action: 'alert',
      title: 'Compliance Alert',
      description: 'New regulatory requirements need attention',
      timestamp: '2024-03-17T14:20:00Z',
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      link: '/settings/compliance'
    },
    {
      id: 5,
      type: 'user',
      action: 'joined',
      title: 'New Investor Onboarded',
      description: 'John Smith completed KYC verification',
      timestamp: '2024-03-16T11:30:00Z',
      icon: Users,
      iconColor: 'text-indigo-500',
      link: '/settings/users'
    }
  ];

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

  // Quick actions with updated navigation
  const quickActions = [
    {
      name: 'Create Asset',
      description: 'List a new investment opportunity',
      icon: Building2,
      href: '/assets/new',
      color: 'bg-blue-500'
    },
    {
      name: 'Upload Document',
      description: 'Add files to DocuVault',
      icon: FileText,
      href: '/docuvault',
      color: 'bg-green-500'
    },
    {
      name: 'View Analytics',
      description: 'Check performance metrics',
      icon: BarChart,
      href: '/reports',
      color: 'bg-purple-500'
    },
    {
      name: 'Manage Users',
      description: 'Update user permissions',
      icon: Users,
      href: '/settings/permissions',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Mahesh!</h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your assets and investments today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Asset Value</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(totalAssetValue)}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="sr-only">Increased by</span>
                      12.5%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Return</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatPercentage(averageReturn)}%
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      <ArrowDownRight className="h-4 w-4" />
                      <span className="sr-only">Decreased by</span>
                      2.3%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Assets</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{activeAssets}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="sr-only">Increased by</span>
                      3
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Investors</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {new Intl.NumberFormat('en-US').format(totalInvestors)}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="sr-only">Increased by</span>
                      8
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.name}
                    to={action.href}
                    className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300"
                  >
                    <div>
                      <span className={`rounded-lg inline-flex p-3 ${action.color} bg-opacity-10`}>
                        <Icon className={`h-6 w-6 ${action.color} text-opacity-100`} />
                      </span>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {action.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {action.description}
                      </p>
                    </div>
                    <span
                      className="absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                      aria-hidden="true"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {recentActivity.map((activity, activityIdx) => {
                  const Icon = activity.icon;
                  return (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== recentActivity.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.iconColor} bg-opacity-10`}>
                              <Icon className={`h-5 w-5 ${activity.iconColor}`} />
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-900">{activity.title}</p>
                              <p className="text-sm text-gray-500">{activity.description}</p>
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              <time dateTime={activity.timestamp}>
                                {getRelativeTime(activity.timestamp)}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate('/activity')}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}