import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IPublicClientApplication, AccountInfo, InteractionRequiredAuthError } from '@azure/msal-browser';
import { ApiConfig } from './types';

export class BaseApi {
  private axiosInstance: AxiosInstance;
  private config: ApiConfig;
  private msalInstance: IPublicClientApplication;
  private account: AccountInfo;
  private tokenPromise: Promise<string> | null = null;

  constructor(config: ApiConfig, msalInstance: IPublicClientApplication, account: AccountInfo) {
    this.config = config;
    this.msalInstance = msalInstance;
    this.account = account;
    
    this.axiosInstance = axios.create({
      baseURL: config.endpoint,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    this.setupInterceptors();
  }

  private async getAccessToken(): Promise<string> {
    if (this.tokenPromise) {
      return this.tokenPromise;
    }

    this.tokenPromise = (async () => {
      try {
        const request = {
          scopes: this.config.scopes,
          account: this.account,
        };

        const response = await this.msalInstance.acquireTokenSilent(request);
        return response.accessToken;
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          const response = await this.msalInstance.acquireTokenPopup({
            scopes: this.config.scopes,
            account: this.account,
          });
          return response.accessToken;
        }
        throw error;
      } finally {
        this.tokenPromise = null;
      }
    })();

    return this.tokenPromise;
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await this.getAccessToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        } catch (error) {
          console.error('Failed to get access token:', error);
          return Promise.reject(error);
        }
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (response.status === 204) {
          return { data: null };
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const token = await this.getAccessToken();
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return this.axiosInstance(originalRequest);
          } catch (tokenError) {
            console.error('Token refresh failed:', tokenError);
            return Promise.reject(tokenError);
          }
        }

        return Promise.reject({
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          code: error.response?.data?.code,
        });
      }
    );
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T | null> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.status === 204 ? null : response.data;
    } catch (error) {
      console.error(`GET request failed for ${url}:`, error);
      throw error;
    }
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T | null> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.status === 204 ? null : response.data;
    } catch (error) {
      console.error(`POST request failed for ${url}:`, error);
      throw error;
    }
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T | null> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response.status === 204 ? null : response.data;
    } catch (error) {
      console.error(`PUT request failed for ${url}:`, error);
      throw error;
    }
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T | null> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.status === 204 ? null : response.data;
    } catch (error) {
      console.error(`DELETE request failed for ${url}:`, error);
      throw error;
    }
  }
}