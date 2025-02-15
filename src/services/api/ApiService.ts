import { API_CONFIG, API_ENDPOINTS } from './config';
import { mockAssets } from '../../store/mockData/assets';
import { mockDocuments } from '../../store/mockData/documents';

class ApiService {
  private useMockData = true; // Toggle this based on API availability

  private getHeaders() {
    const headers = new Headers(API_CONFIG.headers);
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    if (this.useMockData) {
      return this.getMockResponse(endpoint, options);
    }

    try {
      const url = `${API_CONFIG.baseURL}${endpoint}`;
      const headers = this.getHeaders();
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('API request error:', error);
      return this.getMockResponse(endpoint, options);
    }
  }

  private getMockResponse(endpoint: string, options: RequestInit = {}) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint === API_ENDPOINTS.assets.getAll) {
          resolve(mockAssets);
        } else if (endpoint === API_ENDPOINTS.documents.getAll) {
          resolve(mockDocuments);
        } else if (endpoint.startsWith('/assets/') && options.method === 'GET') {
          const id = endpoint.split('/').pop();
          resolve(mockAssets.find(asset => asset.id === id));
        } else if (endpoint.startsWith('/documents/') && options.method === 'GET') {
          const id = endpoint.split('/').pop();
          resolve(mockDocuments.find(doc => doc.id === id));
        } else if (endpoint.startsWith('/documents/asset/')) {
          const assetId = endpoint.split('/').pop();
          resolve(mockDocuments.filter(doc => doc.assetId === assetId));
        } else {
          resolve(null);
        }
      }, 500);
    });
  }

  // Assets
  async getAssets() {
    return this.request(API_ENDPOINTS.assets.getAll);
  }

  async getAssetById(id: string) {
    return this.request(API_ENDPOINTS.assets.getById(id));
  }

  async createAsset(data: any) {
    return this.request(API_ENDPOINTS.assets.create, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateAsset(id: string, data: any) {
    return this.request(API_ENDPOINTS.assets.update(id), {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteAsset(id: string) {
    return this.request(API_ENDPOINTS.assets.delete(id), {
      method: 'DELETE'
    });
  }

  // Documents
  async getDocuments() {
    return this.request(API_ENDPOINTS.documents.getAll);
  }

  async getDocumentById(id: string) {
    return this.request(API_ENDPOINTS.documents.getById(id));
  }

  async createDocument(data: any) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    return this.request(API_ENDPOINTS.documents.create, {
      method: 'POST',
      body: formData,
      headers: this.getHeaders()
    });
  }

  async updateDocument(id: string, data: any) {
    return this.request(API_ENDPOINTS.documents.update(id), {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteDocument(id: string) {
    return this.request(API_ENDPOINTS.documents.delete(id), {
      method: 'DELETE'
    });
  }

  async getDocumentsByAsset(assetId: string) {
    return this.request(API_ENDPOINTS.documents.getByAsset(assetId));
  }
}

export const apiService = new ApiService();