import { PublicClientApplication } from '@azure/msal-browser';
import { protectedResources } from '../../core/auth/config';
import { BaseService } from './BaseService';

export class CoreService extends BaseService {
    constructor(msalInstance: PublicClientApplication) {
        super(
            msalInstance,
            protectedResources.core.endpoint,
            protectedResources.core.scopes
        );
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
        return this.executeRequest<any>('get', '/odata/GlobalNavigation', params);
    }
}