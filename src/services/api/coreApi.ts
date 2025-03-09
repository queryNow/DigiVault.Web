import { BaseApi } from './baseApi';
import { protectedResources } from '../../core/auth/msal-config';
import { useMsal } from '@azure/msal-react';
import { IPublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { 
  GlobalNavigationResponse, 
  UserResponse, 
  CreateUpdateUserRequest, 
  ODataParams, 
  User, 
  UserGroup,
  UserGroupResponse,
  CreateUpdateGroupRequest,
  PermissionLevelResponse
} from './types';

export interface CurrentUser {
  Read: boolean;
  [key: string]: any;
}

export interface AdminCheckResponse {
  value: boolean;
}

export class CoreApi extends BaseApi {
  constructor(getMsalInstance: () => IPublicClientApplication, account: AccountInfo) {
    super(protectedResources.core, getMsalInstance(), account);
  }

  async getCurrentUser() {
    return this.get<CurrentUser>('/currentuser');
  }

  async checkAdminAccess() {
    return this.get<AdminCheckResponse>('/contribute');
  }

  async getGlobalNavigation() {
    const response = await this.get<GlobalNavigationResponse>('/GlobalNavigation');
    return response.value;
  }

  async getUsers(params?: ODataParams) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/Users?${queryParams.toString()}`;
    return this.get<UserResponse>(url);
  }

  async createUser(user: CreateUpdateUserRequest) {
    return this.post<User>('/Users', user);
  }

  async updateUser(id: number, user: CreateUpdateUserRequest) {
    return this.put<User>(`/Users(${id})`, user);  // Fixed: Use PUT and correct endpoint
  }

  async getUserGroups(params?: ODataParams) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/UserGroups?${queryParams.toString()}`;
    return this.get<UserGroupResponse>(url);
  }

  async createGroup(group: CreateUpdateGroupRequest) {
    return this.post<UserGroup>('/UserGroups', group);
  }

  async updateGroup(id: number, group: CreateUpdateGroupRequest) {
    return this.put<UserGroup>(`/UserGroups(${id})`, group);  // Fixed: Add ID to endpoint
  }

  async deleteGroup(id: number) {
    return this.delete(`/UserGroups(${id})`);
  }

  async getPermissionLevels() {
    return this.get<PermissionLevelResponse>('/PermissionLevels');
  }
}

export const useCoreApi = () => {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  
  if (!account) {
    throw new Error('No active account');
  }

  return new CoreApi(() => instance, account);
};