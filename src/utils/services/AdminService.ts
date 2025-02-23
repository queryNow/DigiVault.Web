import { PublicClientApplication } from '@azure/msal-browser';
import { protectedResources } from '../../core/auth/config';
import { BaseService } from './BaseService';

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
}