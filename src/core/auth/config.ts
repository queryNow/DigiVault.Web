export const msalConfig = {
  auth: {
    clientId: '404fe485-7cf7-4895-9963-305418869957',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
    postLogoutRedirectUri: `${window.location.origin}/login`,
    navigateToLoginRequestUrl: true
  },
  system: {
    allowRedirectInIframe: false,
    windowHashTimeout: 9000,
    iframeHashTimeout: 9000,
    loadFrameTimeout: 9000
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true
  }
};

export const loginRequest = {
  scopes: ['User.Read', 'profile', 'openid', 'email'],
  prompt: 'select_account'
};

export const graphConfig = {
  endpoint: 'https://graph.microsoft.com/v1.0'
};

export const protectedResources = {
  core: {
    endpoint: 'http://4.159.113.181',
    scopes: ["api://f7eb650b-90f8-4539-857b-215204bc2248/dvcore_user_impersonation"]
  },
  admin: {
    endpoint: 'http://4.158.103.105',
    scopes: ["api://04e225a5-2bbc-4e55-82e7-c47ae3aa1db2/dvadmin_user_impersonation"]
  },
  asset: {
    endpoint: 'http://172.166.92.198',
    scopes: ["api://f433817b-a1c9-4935-a4a5-2f0df52fdf9a/dvasset_user_impersonation"]
  },
  document: {
    endpoint: 'http://172.187.108.216',
    scopes: ["api://e37ee269-63f1-44b5-84fd-0dc0b4803bf9/dvdocument_user_impersonation"]
  }
};