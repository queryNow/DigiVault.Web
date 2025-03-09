import React, { useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../../../core/auth/msal-config';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          <img 
            src="https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=64&h=64&fit=crop&auto=format"
            alt="DigiVault Logo"
            className="h-16 w-16 mx-auto rounded-lg"
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to DigiVault</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your secure digital asset management solution
          </p>
          <button
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:ring-offset-gray-800 transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;