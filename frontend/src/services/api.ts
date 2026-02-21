import axios from 'axios';
import type {
  Campaign,
  Donation,
  CampaignUpdate,
  ApiError,
  CreateDonationRequest,
  CreateDonationResponse
} from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8003';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export class DonationAPI {
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

      if (error.response?.data) {
        const apiError = error.response.data as ApiError;
        throw new Error(apiError.error || `Server error: ${error.response.status}`);
      }
    }

    throw new Error('Network error. Please check your connection and try again.');
  }
}

export default api;
