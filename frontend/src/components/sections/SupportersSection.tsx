import React, { useState, useEffect } from 'react';
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

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Supporters</h2>
          <p className="text-gray-600">Amazing people making this possible</p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Be the first to support Matt's journey!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {donations.map((donation) => (
              <div key={donation.id} className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-semibold text-gray-900">
                    {donation.donor_name || 'Anonymous Supporter'}
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    ${donation.amount}
                  </div>
                </div>
                
                {donation.message && (
                  <p className="text-gray-600 text-sm italic">"{donation.message}"</p>
                )}
                
                <div className="text-xs text-gray-500 mt-3">
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