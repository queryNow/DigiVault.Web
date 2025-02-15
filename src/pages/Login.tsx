import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthProvider';
import { LogIn, Building2, AlertTriangle, Loader2 } from 'lucide-react';

export default function Login() {
  const { login, error, isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isInitialized, navigate, location]);

  const handleLogin = async () => {
    try {
      // Check if we're in an iframe
      if (window.self !== window.top) {
        window.top.location.href = window.location.href;
        return;
      }

      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-blue-50 to-white" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#6366f120_1px,transparent_1px),linear-gradient(-45deg,#6366f120_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div>
          <div className="flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-3">
                <Building2 className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Welcome to iTouch DigiVault
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            Your Digital Asset Management Platform
          </p>
        </div>
        
        {/* Error Alert */}
        {error && (
          <div className="mt-8 rounded-lg bg-red-50/90 backdrop-blur-sm p-4 border border-red-200">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Sign in failed</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sign In Button */}
        <div className="mt-8 space-y-6">
          <button
            onClick={handleLogin}
            className="group relative w-full flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isInitialized}
          >
            <span className="absolute left-4 inset-y-0 flex items-center">
              {!isInitialized ? (
                <Loader2 className="h-5 w-5 text-white/70 animate-spin" />
              ) : (
                <LogIn className="h-5 w-5 text-white/70 group-hover:text-white/90 transition-colors" />
              )}
            </span>
            {!isInitialized ? 'Initializing...' : 'Sign in with Microsoft'}
          </button>
          
          {/* Additional Info */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 py-1 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 shadow-sm">
                  Secure Enterprise Login
                </span>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-gray-600">
              By signing in, you agree to our{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}