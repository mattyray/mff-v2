import axios from 'axios';
import type { 
  Campaign, 
  Donation, 
  CampaignUpdate, 
  User, 
  ApiError,
  CreateDonationRequest,
  CreateDonationResponse
} from '../types/index';

// Read from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8003';

console.log('🔧 Environment check:');
console.log('  - API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
      console.log('🔑 Adding auth token to request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`❌ API Error: ${error.response?.status}`, error.response?.data);
    return Promise.reject(error);
  }
);

export class DonationAPI {
  // Campaign endpoints
  static async getCampaign(): Promise<Campaign> {
    try {
      const response = await api.get<Campaign>('/api/donations/campaign/');
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  static async getCampaignUpdates(): Promise<CampaignUpdate[]> {
    try {
      const response = await api.get<CampaignUpdate[]>('/api/donations/updates/');
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  static async getRecentDonations(): Promise<Donation[]> {
    try {
      const response = await api.get<Donation[]>('/api/donations/recent/');
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  static async createDonation(donationData: CreateDonationRequest): Promise<CreateDonationResponse> {
    try {
      const response = await api.post('/api/donations/create/', donationData);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Auth endpoints
  static async googleAuth(credential: string, userInfo: any) {
    try {
      console.log('🔑 Sending Google auth request...');
      const response = await api.post('/api/accounts/auth/google/', { 
        credential: credential,
        user_info: userInfo
      });
      console.log('✅ Google auth successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Google auth failed:', error);
      throw this.handleApiError(error);
    }
  }

  static async facebookAuth(accessToken: string, userInfo: any) {
    try {
      console.log('🔑 Sending Facebook auth request...');
      const response = await api.post('/api/accounts/auth/facebook/', { 
        access_token: accessToken,
        user_info: userInfo
      });
      console.log('✅ Facebook auth successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Facebook auth failed:', error);
      throw this.handleApiError(error);
    }
  }

  static async refreshUserSession(): Promise<User> {
    try {
      const response = await api.get('/api/accounts/me/');
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  static async signUp(email: string, password: string, firstName?: string, lastName?: string) {
    try {
      const response = await api.post('/api/accounts/signup/', {
        email,
        password,
        first_name: firstName || '',
        last_name: lastName || ''
      });
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  static async login(email: string, password: string) {
    try {
      const response = await api.post('/api/accounts/login/', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  static async logout() {
    try {
      await api.post('/api/accounts/logout/');
      localStorage.removeItem('authToken');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('authToken');
      return false;
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      await api.get('/health/');
      return true;
    } catch (error) {
      return false;
    }
  }

  private static handleApiError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to server. Make sure the backend is running.');
      }
      
      if (error.response?.status === 401) {
        const errorData = error.response.data as ApiError;
        throw new Error(errorData.error || 'Authentication failed');
      }
      
      if (error.response?.data) {
        const apiError = error.response.data as ApiError;
        throw new Error(apiError.error || `Server error: ${error.response.status}`);
      }
    }
    
    throw new Error('Network error. Please check your connection and try again.');
  }
}

export default api;