import { Configuration, PopupRequest } from "@azure/msal-browser";
import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: `https://login.microsoftonline.com/common`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

export const loginRequest: PopupRequest = {
  scopes: ["User.Read"]
};

export const protectedResources = {
  core: {
    endpoint: 'http://131.145.19.77/core',
    scopes: ['api://f7eb650b-90f8-4539-857b-215204bc2248/dvcore_user_impersonation'],
  },
  admin: {
    endpoint: 'http://131.145.19.77/admin',
    scopes: ['api://04e225a5-2bbc-4e55-82e7-c47ae3aa1db2/dvadmin_user_impersonation'],
  },
  asset: {
    endpoint: 'http://131.145.19.77/asset',
    scopes: ['api://f433817b-a1c9-4935-a4a5-2f0df52fdf9a/dvasset_user_impersonation'],
  },
  document: {
    endpoint: 'http://131.145.19.77/document',
    scopes: ['api://e37ee269-63f1-44b5-84fd-0dc0b4803bf9/dvdocument_user_impersonation'],
  },
  tenant: {
    endpoint: 'http://131.145.19.77/tenant',
    scopes: ['api://e37ee269-63f1-44b5-84fd-0dc0b4803bf9/dvtenant_user_impersonation'],
  },
  openai: {
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY
  }
};

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);
// Initialize the instance
msalInstance.initialize();