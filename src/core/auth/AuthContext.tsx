import { createContext, useContext, ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import { useMsal } from '@azure/msal-react';
import { AccountInfo } from '@azure/msal-browser';
import { CoreApi } from '../../services/api/coreApi';

interface AuthContextType {
  account: AccountInfo | null;
  isAuthorized: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { instance, accounts, inProgress } = useMsal();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const account = accounts[0] || null;

  const checkAuthorization = useCallback(async () => {
    if (!account || inProgress !== 'none') {
      setIsLoading(false);
      return;
    }

    try {
      const coreApi = new CoreApi(() => instance, account);
      const [userData, adminCheck] = await Promise.all([
        coreApi.getCurrentUser(),
        coreApi.checkAdminAccess()
      ]);

      // Default to authorized if we get a 204 response
      setIsAuthorized(userData === null ? true : userData.Read);
      setIsAdmin(adminCheck === null ? false : adminCheck.value);
    } catch (error) {
      console.error('Authorization check failed:', error);
      setIsAuthorized(false);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [account, inProgress, instance]);

  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();
    
    checkAuthorization();

    return () => {
      controller.abort();
    };
  }, [checkAuthorization]);

  const contextValue = useMemo(() => ({
    account,
    isAuthorized,
    isAdmin,
    isLoading
  }), [account, isAuthorized, isAdmin, isLoading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};