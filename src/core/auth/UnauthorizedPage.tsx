import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4">
      <ShieldOff className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Unauthorized Access</h1>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
        You don't have permission to access this application.
      </p>
      <button
        onClick={handleGoHome}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:ring-offset-gray-900"
      >
        Go to Home
      </button>
    </div>
  );
};

export default UnauthorizedPage;