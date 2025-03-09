import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useCoreApi } from '../../../services/api/coreApi';
import LoadingSpinner from '../../../core/components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { accounts } = useMsal();
  const username = accounts[0]?.username;
  const coreApi = useCoreApi();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await coreApi.getCurrentUser();
        setUserData(data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [coreApi]);

  if (isLoading) {
    return <LoadingSpinner fullScreen={false} />;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
      <p className="text-gray-600">Welcome back, {username}</p>
      {userData && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900">Your Permissions</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(userData).map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{key}</h4>
                <p className="mt-1 text-sm text-gray-600">
                  {value ? '✓ Enabled' : '✗ Disabled'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;