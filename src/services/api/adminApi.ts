import { BaseApi } from './baseApi';
import { protectedResources } from '../../core/auth/msal-config';
import { useMsal } from '@azure/msal-react';
import { IPublicClientApplication, AccountInfo } from '@azure/msal-browser';

export interface AdminNavigationItem {
  Id: number;
  Title: string;
  Description: string;
  Icon: string;
  Link: string;
  Module: {
    Id: number;
    Name: string;
    Code: string;
    EnableManagement: boolean;
  };
  EnableNav: boolean;
  ParentId: number;
  DisplayOrder: number;
}

export class AdminApi extends BaseApi {
  constructor(getMsalInstance: () => IPublicClientApplication, account: AccountInfo) {
    super(protectedResources.admin, getMsalInstance(), account);
  }

  async getAdminNavigation(): Promise<AdminNavigationItem[]> {
    try {
      const response = await this.get<{ value: AdminNavigationItem[] }>('/AdminNavigation');
      return response.value || [];
    } catch (error) {
      console.error('Failed to fetch admin navigation:', error);
      throw error;
    }
  }
}

export const useAdminApi = () => {
  const { instance, accounts } = useMsal();
  const account = accounts[0];

  if (!account) {
    throw new Error('No active account! Please sign in first.');
  }

  return new AdminApi(() => instance, account);
};