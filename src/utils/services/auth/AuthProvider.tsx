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

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL instance
msalInstance.initialize().catch(console.error);

function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.errorMessage) return error.errorMessage;
  if (error?.message) return error.message;
  if (error?.toString) return error.toString();
  return 'An unknown error occurred';
}

async function getProfilePhoto(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${graphConfig.endpoint}/me/photo/$value`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return null;
  }
  catch (error) {
    console.error('Error fetching profile photo:', getErrorMessage(error));
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
        account: account,
        scopes: [...loginRequest.scopes, 'User.Read']
      });
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // Token expired or user needs to re-authenticate
        return msalInstance.acquireTokenRedirect({
          ...loginRequest,
          account: account,
          scopes: [...loginRequest.scopes, 'User.Read']
        });
      }
      throw error;
    }
  };

  const updateUserData = async (account: any) => {
    try {
      if (!account) {
        throw new Error('No account data available');
      }

      // Clear any existing errors
      setError(null);

      // Get fresh token
      const tokenResponse = await acquireToken(account);

      // Get user photo if we have a token response
      const photo = tokenResponse?.accessToken ? 
        await getProfilePhoto(tokenResponse.accessToken) : 
        null;
      
      // Update user object with photo
      setUser({
        ...account,
        photo: photo || account.photo
      });
      setIsAuthenticated(true);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Error updating user data:', errorMessage);
      // Still set the user but without photo
      setUser(account);
      setIsAuthenticated(true);
      setError('Unable to fetch complete profile data');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Clear any existing login state
        clearInteractionState();

        // Check for existing session first
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          // User is already logged in
          msalInstance.setActiveAccount(accounts[0]);
          await updateUserData(accounts[0]);
          setIsInitialized(true);
          return;
        }

        // No existing session, handle any pending redirect
        if (!handleRedirectPromiseRef.current) {
          handleRedirectPromiseRef.current = msalInstance.handleRedirectPromise();
        }

        const response = await handleRedirectPromiseRef.current;
        
        if (response) {
          // Set active account if we get a response from redirect
          msalInstance.setActiveAccount(response.account);
          await updateUserData(response.account);
        }
        clearInteractionState();
      } catch (error) {
        console.error('Error in auth initialization:', error);
        clearInteractionState();
        setError(getErrorMessage(error));
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Set up event callbacks
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
          // Update user data when token is refreshed
          const tokenResult = event.payload as AuthenticationResult;
          if (tokenResult.account) {
            await updateUserData(tokenResult.account);
          }
          break;
      }
    });

    return () => {
      if (callbackId) {
        msalInstance.removeEventCallback(callbackId);
      }
      // Clear all timeouts
      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current);
      }
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      // Ensure login state is cleared
      loginInProgressRef.current = false;
      setIsLoggingIn(false);
    };
  }, []);

  const login = async () => {
    try {
      // Check if user is already logged in
      if (interactionInProgressRef.current || isLoggingIn) {
        console.log('Login already in progress');
        return;
      }

      // Reset state before starting new login
      setError(null);
      setIsLoggingIn(true);
      interactionInProgressRef.current = true;

      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
        await updateUserData(accounts[0]);
        clearInteractionState();
        return;
      }

      // Handle iframe scenarios
      if (window.self !== window.top) {
        const currentUrl = new URL(window.location.href);
        const topUrl = new URL(window.top.location.href);
        
        // Only redirect if we're on a different origin or path
        if (currentUrl.origin !== topUrl.origin || currentUrl.pathname !== topUrl.pathname) {
          window.top.location.href = window.location.href;
          clearInteractionState();
          return;
        }
      }

      // Clear any existing timeout
      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current);
      }

      // Set timeout to clear login state if it takes too long
      loginTimeoutRef.current = setTimeout(clearInteractionState, 30000);

      // Check if we're in a popup or redirect flow
      if (BrowserUtils.isInIframe() || BrowserUtils.isInPopup()) {
        clearInteractionState();
        throw new Error('Authentication cannot be initiated in a popup or iframe');
      }

      // Start login process
      return msalInstance.loginRedirect({
        ...loginRequest,
        prompt: 'select_account'
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Login error:', errorMessage);
      clearInteractionState();
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      // Clear any existing errors
      setError(null);

      // Prevent logout if login is in progress or interaction is happening
      if (isLoggingIn || interactionInProgressRef.current) {
        throw new Error('Cannot logout while login is in progress');
      }

      // Clear any existing redirect handling
      handleRedirectPromiseRef.current = null;

      // Clear any existing timeouts and state
      clearInteractionState();

      await msalInstance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin + '/login',
        onRedirectNavigate: () => {
          // Clear user data before redirect
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
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}