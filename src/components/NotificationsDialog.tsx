import React from 'react';
import { X, Bell, Clock, FileText, Users, DollarSign, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

interface NotificationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'New Document Upload',
    message: 'A new document "Q1 2024 Financial Report" has been uploaded to DocuVault.',
    time: '5 minutes ago',
    read: false,
    action: {
      label: 'View Document',
      href: '/docuvault'
    }
  },
  {
    id: '2',
    type: 'warning',
    title: 'Pending Approval Required',
    message: 'Asset "Commercial Property A" requires your approval for listing.',
    time: '1 hour ago',
    read: false,
    action: {
      label: 'Review Asset',
      href: '/assets/1'
    }
  },
  {
    id: '3',
    type: 'success',
    title: 'Transaction Complete',
    message: 'Investment transaction #12345 has been successfully processed.',
    time: '2 hours ago',
    read: true
  },
  {
    id: '4',
    type: 'error',
    title: 'Failed Compliance Check',
    message: 'Asset "Tech Startup Portfolio" failed automated compliance verification.',
    time: '3 hours ago',
    read: true,
    action: {
      label: 'View Details',
      href: '/assets/2'
    }
  }
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'info':
      return <FileText className="h-5 w-5 text-blue-400" />;
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-yellow-400" />;
    case 'success':
      return <DollarSign className="h-5 w-5 text-green-400" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-400" />;
    default:
      return <Bell className="h-5 w-5 text-gray-400" />;
  }
};

export default function NotificationsDialog({ isOpen, onClose }: NotificationsDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <Bell className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Stay updated with your latest activities and important updates.
                  </p>
                </div>
              </div>
              <div className="ml-auto">
                <button
                  onClick={onClose}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {MOCK_NOTIFICATIONS.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 ${notification.read ? '' : 'bg-indigo-50'}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                      <div className="mt-2 flex items-center">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="ml-1 text-xs text-gray-500">{notification.time}</span>
                        {notification.action && (
                          <a
                            href={notification.action.href}
                            className="ml-4 text-xs font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            {notification.action.label}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={() => {/* Mark all as read */}}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Mark all as read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}