import axios from 'axios';
import { PublicClientApplication } from '@azure/msal-browser';
import { loginRequest, graphConfig } from '../../core/auth/config';
import { BaseService } from './BaseService';

export class GraphService extends BaseService {
    constructor(msalInstance: PublicClientApplication) {
        super(
            msalInstance,
            graphConfig.endpoint,
            [...loginRequest.scopes, 'User.Read']
        );
    }

    async getProfilePhoto(): Promise<Blob> {
        try {
            const token = await this.getAccessToken();
            const response = await this.axiosInstance.get('/me/photo/$value', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                throw new Error('Profile photo not found');
            }
            throw error;
        }
    }

    async getUserProfile(): Promise<any> {
        return this.executeRequest<any>('get', '/me');
    }
}