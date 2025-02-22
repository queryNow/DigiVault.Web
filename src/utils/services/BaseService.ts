import axios, { AxiosInstance } from 'axios';
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';

export abstract class BaseService {
    protected axiosInstance: AxiosInstance;
    protected msalInstance: PublicClientApplication;

    constructor(
        msalInstance: PublicClientApplication,
        baseURL: string,
        protected scopes: string[]
    ) {
        this.msalInstance = msalInstance;
        this.axiosInstance = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    protected async getAccessToken(): Promise<string> {
        const account = this.msalInstance.getActiveAccount();
        if (!account) {
            throw new Error('No active account! Verify a user has been signed in.');
        }

        try {
            const response = await this.msalInstance.acquireTokenSilent({
                scopes: this.scopes,
                account
            });
            return response.accessToken;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                await this.msalInstance.acquireTokenRedirect({
                    scopes: this.scopes,
                    account
                });
                throw new Error('Interaction required. Please complete the authentication.');
            }
            throw error;
        }
    }

    protected async executeRequest<T>(
        method: 'get' | 'post' | 'put' | 'delete',
        endpoint: string,
        data?: any
    ): Promise<T> {
        try {
            const token = await this.getAccessToken();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            let response;
            switch (method) {
                case 'get':
                    response = await this.axiosInstance.get<T>(endpoint, config);
                    break;
                case 'post':
                    response = await this.axiosInstance.post<T>(endpoint, data, config);
                    break;
                case 'put':
                    response = await this.axiosInstance.put<T>(endpoint, data, config);
                    break;
                case 'delete':
                    response = await this.axiosInstance.delete<T>(endpoint, config);
                    break;
            }

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }
}
