import React, { useState, useEffect } from 'react';
import { DonationAPI } from '../../services/api';
import type { Campaign, CampaignUpdate } from '../../types/index';

interface UpdatesSectionProps {
  campaign: Campaign;
}

const UpdatesSection: React.FC<UpdatesSectionProps> = ({ campaign }) => {
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const data = await DonationAPI.getCampaignUpdates();
        setUpdates(data);
      } catch (error) {
        console.error('Failed to load updates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  return (
    <section id="updates" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Campaign Updates</h2>
          <p className="text-gray-600">Follow Matt's progress and journey</p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : updates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No updates yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {updates.map((update) => (
              <div key={update.id} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{update.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(update.created_at).toLocaleDateString()}
                  </span>
                </div>

                {update.has_video && update.video_url && (
                  <div className="mb-6">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <a 
                        href={update.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        ▶ Watch Video Update
                      </a>
                    </div>
                  </div>
                )}

                <div className="prose text-gray-600">
                  <p>{update.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpdatesSection;