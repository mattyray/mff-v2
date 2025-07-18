// Donation Platform Types - FIXED VERSION

export interface Campaign {
  id: number;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  progress_percentage: number;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  featured_image?: string;
  featured_video_url?: string;  // ← ADDED THIS LINE
  created_at: string;
  updated_at: string;
}

export interface DonationTier {
  id: number;
  name: string;
  amount: number;
  description: string;
  campaign: number;
}

export interface Donation {
  id: number;
  amount: number;
  donor_name?: string;
  donor_email?: string;
  message?: string;
  is_anonymous: boolean;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  campaign: number;
  tier?: DonationTier;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}

export interface CampaignUpdate {
  id: number;
  title: string;
  content: string;
  video_url?: string;
  video_embed_code?: string;
  image_url?: string;
  has_video: boolean;
  created_at: string;
}

export interface CreateDonationRequest {
  amount: number;
  donor_name?: string;
  donor_email?: string;
  message?: string;
  is_anonymous: boolean;
}

export interface CreateDonationResponse {
  checkout_url: string;
  donation_id: number;
}