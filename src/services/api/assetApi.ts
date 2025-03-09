import { BaseApi } from './baseApi';
import { protectedResources } from '../../core/auth/msal-config';
import { useMsal } from '@azure/msal-react';
import { IPublicClientApplication, AccountInfo } from '@azure/msal-browser';

export class AssetApi extends BaseApi {
  constructor(getMsalInstance: () => IPublicClientApplication, account: AccountInfo) {
    super(protectedResources.asset, getMsalInstance(), account);
  }
}

export const useAssetApi = () => {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  
  if (!account) {
    throw new Error('No active account');
  }

  return new AssetApi(() => instance, account);
};