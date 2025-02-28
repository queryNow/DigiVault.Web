import { PublicClientApplication } from '@azure/msal-browser';
import { protectedResources } from '../../core/auth/config';
import { BaseService } from './BaseService';
import { User, Group } from '../types/permissions';

export class AdminService extends BaseService {
    constructor(msalInstance: PublicClientApplication) {
        super(
            msalInstance,
            protectedResources.admin.endpoint,
            protectedResources.admin.scopes
        );
    }

    async getAdminNavigationItems(): Promise<any> {
        const params = {
            $orderby: "DisplayOrder"
        }
        return this.executeRequest<any>('get', '/odata/AdminNavigation', params);
    }

    async getUsers(): Promise<any> {
        return this.executeRequest<any>('get', '/odata/Users');
    }

    async getUserGroups(): Promise<any> {
        return this.executeRequest<any>('get', '/odata/UserGroups');
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
}