import { PublicClientApplication } from '@azure/msal-browser';
import { protectedResources } from '../../core/auth/config';
import { BaseService } from './BaseService';
import { User, Group } from '../types/permissions';

interface ODataParams {
  $filter?: string;
  $orderby?: string;
  $top?: number;
  $skip?: number;
  $count?: boolean;
  $search?: string;
  $select?: string;
  $expand?: string;
}

export class CoreService extends BaseService {
    constructor(msalInstance: PublicClientApplication) {
        super(
            msalInstance,
            protectedResources.core.endpoint,
            protectedResources.core.scopes
        );
    }

    async getUsers(params?: ODataParams): Promise<any> {
        return this.executeRequest<any>('get', '/odata/Users', undefined, params);
    }

    async getUserGroups(params?: ODataParams): Promise<any> {
        return this.executeRequest<any>('get', '/odata/UserGroups', undefined, params);
    }

    async getCurrentUser(): Promise<any> {
        return this.executeRequest<any>('get', '/odata/currentuser');
    }

    async isAuthorized(): Promise<boolean> {
        try {
            const response = await this.executeRequest<any>('get', '/odata/currentuser');
            return response.Read;
        } catch (error) {
            console.error('Authorization check failed:', error);
            return false;
        }
    }

    async isAdmin(): Promise<boolean> {
        try {
            const response = await this.executeRequest<any>('get', '/odata/contribute');
            return response.value;
        } catch (error) {
            console.error('Admin Authorization check failed:', error);
            return false;
        }
    }

    async getNavigationItems(): Promise<any> {
        const params = {
            $orderby: "Order"
        }
        return this.executeRequest<any>('get', '/odata/GlobalNavigation', undefined, params);
    }

    // User Management
    async getUserById(id: string): Promise<any> {
        return this.executeRequest<any>('get', `/odata/Users(${id})`);
    }

    async createUser(userData: any): Promise<any> {
        const payload = {
            FirstName: userData.firstName || userData.name.split(' ')[0],
            LastName: userData.lastName || userData.name.split(' ').slice(1).join(' '),
            Email: userData.email,
            IsActive: userData.status === 'Active'
        };
        
        return this.executeRequest<any>('post', '/odata/Users', payload);
    }

    async updateUser(id: string, userData: any): Promise<any> {
        const payload: any = {};
        
        if (userData.name) {
            const nameParts = userData.name.split(' ');
            payload.FirstName = nameParts[0];
            payload.LastName = nameParts.slice(1).join(' ');
        }
        
        if (userData.email) {
            payload.Email = userData.email;
        }
        
        if (userData.status) {
            payload.IsActive = userData.status === 'Active';
        }
        
        return this.executeRequest<any>('put', `/odata/Users(${id})`, payload);
    }

    async deleteUser(id: string): Promise<any> {
        return this.executeRequest<any>('delete', `/odata/Users(${id})`);
    }

    async assignUserToGroup(userId: string, groupId: string): Promise<any> {
        const payload = {
            UserId: userId,
            UserGroupId: groupId
        };
        
        return this.executeRequest<any>('post', '/odata/UserGroupUsers', payload);
    }

    async removeUserFromGroup(userId: string, groupId: string): Promise<any> {
        // First, find the UserGroupUsersXref ID
        const users = await this.getUsers();
        const user = users.value.find((u: any) => u.Id.toString() === userId);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        const xref = user.UserGroupUsersXref.find((x: any) => 
            x.UserGroup.Id.toString() === groupId
        );
        
        if (!xref) {
            throw new Error('User is not a member of this group');
        }
        
        return this.executeRequest<any>('delete', `/odata/UserGroupUsers(${xref.Id})`);
    }

    // Group Management
    async getUserGroupById(id: string): Promise<any> {
        return this.executeRequest<any>('get', `/odata/UserGroups(${id})`);
    }

    async createUserGroup(groupData: any): Promise<any> {
        const payload = {
            Name: groupData.name,
            Description: groupData.description,
            Precedence: groupData.precedence || 0
        };
        
        return this.executeRequest<any>('post', '/odata/UserGroups', payload);
    }

    async updateUserGroup(id: string, groupData: any): Promise<any> {
        const payload: any = {};
        
        if (groupData.name) {
            payload.Name = groupData.name;
        }
        
        if (groupData.description) {
            payload.Description = groupData.description;
        }
        
        if (groupData.precedence !== undefined) {
            payload.Precedence = groupData.precedence;
        }
        
        return this.executeRequest<any>('put', `/odata/UserGroups(${id})`, payload);
    }

    async deleteUserGroup(id: string): Promise<any> {
        return this.executeRequest<any>('delete', `/odata/UserGroups(${id})`);
    }

    async assignPermissionToGroup(groupId: string, permissionLevelId: string): Promise<any> {
        const payload = {
            UserGroupId: groupId,
            PermissionLevelId: permissionLevelId
        };
        
        return this.executeRequest<any>('post', '/odata/UserGroupPermissionLevels', payload);
    }

    async removePermissionFromGroup(groupId: string, permissionLevelId: string): Promise<any> {
        // First, find the UserGroupPermissionLevelXref ID
        const groups = await this.getUserGroups();
        const group = groups.value.find((g: any) => g.Id.toString() === groupId);
        
        if (!group) {
            throw new Error('Group not found');
        }
        
        const xref = group.UserGroupPermissionLevelXref.find((x: any) => 
            x.PermissionLevel.Id.toString() === permissionLevelId
        );
        
        if (!xref) {
            throw new Error('Group does not have this permission');
        }
        
        return this.executeRequest<any>('delete', `/odata/UserGroupPermissionLevels(${xref.Id})`);
    }

    // Transform API response to our User model
    transformApiUserToUser(apiUser: any): User {
        const groups = apiUser.UserGroupUsersXref.map((xref: any) => xref.UserGroup.Name);
        
        return {
            id: apiUser.Id.toString(),
            name: `${apiUser.FirstName} ${apiUser.LastName}`,
            email: apiUser.Email,
            role: groups.includes('Administrators') ? 'Administrator' : 
                  groups.includes('Approvers') ? 'Approver' : 'User',
            status: apiUser.IsActive ? 'Active' : 'Inactive',
            lastLogin: new Date().toISOString(), // API doesn't provide this, using current date as placeholder
            groups: groups
        };
    }

    // Transform API response to our Group model
    transformApiGroupToGroup(apiGroup: any): Group {
        // Extract permissions from the UserGroupPermissionLevelXref
        const permissions: string[] = [];
        
        if (apiGroup.UserGroupPermissionLevelXref) {
            apiGroup.UserGroupPermissionLevelXref.forEach((xref: any) => {
                const permLevel = xref.PermissionLevel;
                if (permLevel.Read) permissions.push('read');
                if (permLevel.Write) permissions.push('write');
                if (permLevel.Update) permissions.push('update');
                if (permLevel.Delete) permissions.push('delete');
            });
        }
        
        return {
            id: apiGroup.Id.toString(),
            name: apiGroup.Name,
            description: apiGroup.Description,
            members: 0, // This will be calculated later
            permissions: [...new Set(permissions)] // Remove duplicates
        };
    }

    // Transform our User model to API format
    transformUserToApiUser(user: User): any {
        const nameParts = user.name.split(' ');
        return {
            FirstName: nameParts[0],
            LastName: nameParts.slice(1).join(' '),
            Email: user.email,
            IsActive: user.status === 'Active'
        };
    }

    // Transform our Group model to API format
    transformGroupToApiGroup(group: Group): any {
        return {
            Name: group.name,
            Description: group.description,
            Precedence: 0 // Default precedence
        };
    }

    // Helper method to build OData filter string
    buildODataFilter(filters: Record<string, any>): string {
        const conditions = [];
        
        for (const [key, value] of Object.entries(filters)) {
            if (value !== undefined && value !== null && value !== '') {
                if (typeof value === 'string') {
                    if (value.includes('*')) {
                        // Handle wildcard search
                        conditions.push(`contains(${key}, '${value.replace(/\*/g, '')}')`);
                    } else {
                        conditions.push(`${key} eq '${value}'`);
                    }
                } else if (typeof value === 'boolean') {
                    conditions.push(`${key} eq ${value}`);
                } else if (typeof value === 'number') {
                    conditions.push(`${key} eq ${value}`);
                }
            }
        }
        
        return conditions.length > 0 ? conditions.join(' and ') : '';
    }
}