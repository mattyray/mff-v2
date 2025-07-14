// Donation Platform Types

export interface Campaign {
  id: number;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  is_active: boolean;
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