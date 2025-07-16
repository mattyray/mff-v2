import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { DonationAPI } from '../../services/api';
import type { Donation } from '../../types/index';

const SupportersSection: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await DonationAPI.getRecentDonations();
        setDonations(data);
      } catch (error) {
        console.error('Failed to load donations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  if (loading) {
    return (
      <section className="section-spacing bg-white">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--ocean-blue)] mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">Recent Supporters</h2>
          <p className="text-xl text-[var(--ocean-driftwood)]">
            Amazing people making this journey possible
          </p>
        </div>

        {donations.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-[var(--ocean-blue)] mx-auto mb-4" />
            <p className="text-[var(--ocean-driftwood)]">Be the first to support Matt's journey!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <div key={donation.id} className="card-ocean">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-semibold text-[var(--ocean-deep)]">
                    {donation.donor_name || 'Anonymous Supporter'}
                  </div>
                  <div className="text-lg font-bold text-[var(--ocean-blue)]">
                    ${donation.amount}
                  </div>
                </div>
                
                {donation.message && (
                  <div className="flex items-start gap-2 mb-3">
                    <MessageCircle className="w-4 h-4 text-[var(--ocean-teal)] mt-1 flex-shrink-0" />
                    <p className="text-[var(--ocean-driftwood)] text-sm italic">
                      "{donation.message}"
                    </p>
                  </div>
                )}
                
                <div className="text-xs text-[var(--ocean-driftwood)]">
                  {new Date(donation.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SupportersSection;