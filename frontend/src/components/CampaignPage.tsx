import React, { useState, useEffect } from 'react';
import { DonationAPI } from '../services/api';
import type { Campaign } from '../types/index';

// Section components we'll build
import HeroSection from './sections/HeroSection';
import ProgressSection from './sections/ProgressSection';
import DonationSection from './sections/DonationSection';
import UpdatesSection from './sections/UpdatesSection';
import SupportersSection from './sections/SupportersSection';

const CampaignPage: React.FC = () => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await DonationAPI.getCampaign();
        setCampaign(data);
      } catch (error) {
        console.error('Failed to load campaign:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No active campaign found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero - Matt's story + campaign intro */}
      <HeroSection campaign={campaign} />
      
      {/* Progress - Visual progress + stats */}
      <ProgressSection campaign={campaign} />
      
      {/* Donation Form */}
      <DonationSection campaign={campaign} />
      
      {/* Video Updates Feed */}
      <UpdatesSection campaign={campaign} />
      
      {/* Recent Supporters */}
      <SupportersSection />
    </div>
  );
};

export default CampaignPage;