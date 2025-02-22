import { PublicClientApplication } from '@azure/msal-browser';
import { protectedResources } from '../../core/auth/config';
import { BaseService } from './BaseService';

export class UserService extends BaseService {
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
            const response = await this.getCurrentUser();
            return response.Read;
        } catch (error) {
            console.error('Authorization check failed:', error);
            return false;
        }
    }
}