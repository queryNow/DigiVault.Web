import { BaseApi } from './baseApi';
import { protectedResources } from '../../core/auth/msal-config';
import { useMsal } from '@azure/msal-react';
import { IPublicClientApplication, AccountInfo } from '@azure/msal-browser';

export class DocumentApi extends BaseApi {
  constructor(getMsalInstance: () => IPublicClientApplication, account: AccountInfo) {
    super(protectedResources.document, getMsalInstance(), account);
  }
}

export const useDocumentApi = () => {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  
  if (!account) {
    throw new Error('No active account');
  }

  return new DocumentApi(() => instance, account);
};