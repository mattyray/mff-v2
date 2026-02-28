import React, { useState, useEffect } from 'react';
import { DonationAPI } from '../services/api';
import type { Campaign } from '../types/index';

import HeroSection from './sections/HeroSection';
import TicketSection from './sections/TicketSection';
import DonationSection from './sections/DonationSection';
import WantToHelpSection from './sections/WantToHelpSection';
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--ocean-blue)] mx-auto mb-4"></div>
          <p className="text-[var(--ocean-driftwood)]">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--ocean-driftwood)]">No active campaign found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection campaign={campaign} />
      <TicketSection campaign={campaign} />
      <DonationSection campaign={campaign} />
      <WantToHelpSection />
      <SupportersSection />
    </div>
  );
};

export default CampaignPage;
