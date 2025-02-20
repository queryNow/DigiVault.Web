import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig, loginRequest, graphConfig } from './config';
import { BrowserUtils } from '@azure/msal-browser';

interface AuthContextType {
  instance: PublicClientApplication;
  isAuthenticated: boolean;
  user: any;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize().catch(console.error);

const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.errorMessage) return error.errorMessage;
  if (error?.message) return error.message;
  if (error?.toString) return error.toString();
  return 'An unknown error occurred';
};

const getProfilePhoto = async (accessToken: string): Promise<string | null> => {
  try {
    const response = await fetch(`${graphConfig.endpoint}/me/photo/$value`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) return null;
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching profile photo:', getErrorMessage(error));
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  
  const handleRedirectPromiseRef = useRef<Promise<any> | null>(null);
  const loginTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const interactionInProgressRef = useRef<boolean>(false);
  const loginInProgressRef = useRef<boolean>(false);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearInteractionState = () => {
    interactionInProgressRef.current = false;
    loginInProgressRef.current = false;
    setIsLoggingIn(false);
    
    if (loginTimeoutRef.current) {
      clearTimeout(loginTimeoutRef.current);
      loginTimeoutRef.current = null;
    }
    
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }
  };

  const acquireToken = async (account: any) => {
    try {
      return await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
        scopes: [...loginRequest.scopes, 'User.Read']
      });
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        return msalInstance.acquireTokenRedirect({
          ...loginRequest,
          account,
          scopes: [...loginRequest.scopes, 'User.Read']
        });
      }
      throw error;
    }
  };

  const updateUserData = async (account: any) => {
    if (!account) {
      throw new Error('No account data available');
    }

    setError(null);

    try {
      const tokenResponse = await acquireToken(account);
      const photo = tokenResponse?.accessToken ? 
        await getProfilePhoto(tokenResponse.accessToken) : 
        null;
      
      setUser({ ...account, photo: photo || account.photo });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error updating user data:', getErrorMessage(error));
      setUser(account);
      setIsAuthenticated(true);
      setError('Unable to fetch complete profile data');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        clearInteractionState();

        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          msalInstance.setActiveAccount(accounts[0]);
          await updateUserData(accounts[0]);
          setIsInitialized(true);
          return;
        }

        if (!handleRedirectPromiseRef.current) {
          handleRedirectPromiseRef.current = msalInstance.handleRedirectPromise();
        }

        const response = await handleRedirectPromiseRef.current;
        
        if (response) {
          msalInstance.setActiveAccount(response.account);
          await updateUserData(response.account);
        }
      } catch (error) {
        console.error('Error in auth initialization:', error);
        setError(getErrorMessage(error));
      } finally {
        clearInteractionState();
        setIsInitialized(true);
      }
    };

    initializeAuth();

    const callbackId = msalInstance.addEventCallback(async (event: EventMessage) => {
      switch (event.eventType) {
        case EventType.HANDLE_REDIRECT_START:
          interactionInProgressRef.current = true;
          setIsLoggingIn(true);
          break;

        case EventType.HANDLE_REDIRECT_END:
          clearInteractionState();
          break;

        case EventType.LOGIN_SUCCESS:
          const result = event.payload as AuthenticationResult;
          clearInteractionState();
          msalInstance.setActiveAccount(result.account);
          await updateUserData(result.account);
          break;

        case EventType.LOGOUT_SUCCESS:
          setUser(null);
          setIsAuthenticated(false);
          clearInteractionState();
          setError(null);
          break;

        case EventType.LOGIN_FAILURE:
          const errorMessage = event.error ? getErrorMessage(event.error) : 'Login failed';
          console.error('Login failed:', errorMessage);
          clearInteractionState();
          setError(errorMessage);
          break;

        case EventType.ACQUIRE_TOKEN_SUCCESS:
          const tokenResult = event.payload as AuthenticationResult;
          if (tokenResult.account) {
            await updateUserData(tokenResult.account);
          }
          break;
      }
    });

    return () => {
      msalInstance.removeEventCallback(callbackId);
      
      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current);
      }
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      
      loginInProgressRef.current = false;
      setIsLoggingIn(false);
    };
  }, []);

  const login = async () => {
    if (interactionInProgressRef.current || isLoggingIn) {
      console.log('Login already in progress');
      return;
    }

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
      await updateUserData(accounts[0]);
      return;
    }

    if (window.self !== window.top) {
      const currentUrl = new URL(window.location.href);
      const topUrl = new URL(window.top.location.href);
      
      if (currentUrl.origin !== topUrl.origin || currentUrl.pathname !== topUrl.pathname) {
        window.top.location.href = window.location.href;
        return;
      }
    }

    try {
      setError(null);
      setIsLoggingIn(true);
      loginInProgressRef.current = true;
      interactionInProgressRef.current = true;

      handleRedirectPromiseRef.current = null;

      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current);
      }

      loginTimeoutRef.current = setTimeout(() => {
        clearInteractionState();
        setError('Login request timed out. Please try again.');
      }, 30000);

      cleanupTimeoutRef.current = setTimeout(() => {
        clearInteractionState();
      }, 60000);

      if (BrowserUtils.isInIframe() || BrowserUtils.isInPopup()) {
        throw new Error('Authentication cannot be initiated in a popup or iframe');
      }

      await msalInstance.loginRedirect({
        ...loginRequest,
        prompt: 'select_account'
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Login error:', errorMessage);
      setError(errorMessage);
      clearInteractionState();
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    if (isLoggingIn || interactionInProgressRef.current) {
      throw new Error('Cannot logout while login is in progress');
    }

    try {
      setError(null);
      handleRedirectPromiseRef.current = null;
      clearInteractionState();

      await msalInstance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin + '/login',
        onRedirectNavigate: () => {
          setUser(null);
          setIsAuthenticated(false);
          return true;
        }
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Logout error:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    instance: msalInstance,
    isAuthenticated,
    user,
    error,
    login,
    logout,
    isInitialized
  };

  return (
    <AuthContext.Provider value={value}>
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