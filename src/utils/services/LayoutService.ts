import { PublicClientApplication } from '@azure/msal-browser';
import { protectedResources } from '../../core/auth/config';
import { BaseService } from './BaseService';

export class LayoutService extends BaseService {
    constructor(msalInstance: PublicClientApplication) {
        super(
            msalInstance,
            protectedResources.core.endpoint,
            protectedResources.core.scopes
        );
    }

    async getNavigationItems(): Promise<any> {
        return this.executeRequest<any>('get', '/odata/GlobalNavigation');
    }
}