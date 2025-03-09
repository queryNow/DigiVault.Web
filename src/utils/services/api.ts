import { useAuth } from '../../core/context/AuthContext';

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export const useApi = () => {
  const { getAccessToken } = useAuth();
  const baseUrl = import.meta.env.VITE_API_URL;

  const callApi = async (endpoint: string, options: ApiOptions = {}) => {
    const token = await getAccessToken(['api://your-api-client-id/access_as_user']);
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  };

  return { callApi };
};