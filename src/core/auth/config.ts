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
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true
  }
};

export const loginRequest = {
  scopes: [
    'User.Read',
    'profile',
    'openid',
    'email'
  ],
  prompt: 'select_account'
};

export const graphConfig = {
  endpoint: 'https://graph.microsoft.com/v1.0'
};

export const protectedResources = {
  api: {
    endpoint: 'your-api-endpoint',
    scopes: ['your-api-scope']
  }
};