import React, { useState, useEffect } from 'react';
import { Play, Calendar, ExternalLink } from 'lucide-react';
import { DonationAPI } from '../../services/api';
import type { CampaignUpdate } from '../../types/index';

const UpdatesSection: React.FC = () => {
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

  if (loading) {
    return (
      <section className="section-spacing section-ocean-mist">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--ocean-blue)] mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="updates" className="section-spacing section-ocean-mist">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">Latest Updates</h2>
          <p className="text-xl text-[var(--ocean-driftwood)] max-w-2xl mx-auto">
            Follow my journey and see how your support is making a difference
          </p>
        </div>

        {updates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--ocean-driftwood)]">No updates yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {updates.map((update) => (
              <div key={update.id} className="card-ocean">
                {update.image_url && (
                  <img 
                    src={update.image_url} 
                    alt={update.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="flex items-center gap-2 text-[var(--ocean-driftwood)] text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(update.created_at).toLocaleDateString()}
                </div>
                
                <h3 className="text-[var(--ocean-deep)] mb-3">{update.title}</h3>
                <p className="text-[var(--ocean-driftwood)] mb-4">{update.content}</p>
                
                {update.video_url && (
                  <a
                    href={update.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[var(--ocean-blue)] hover:text-[var(--ocean-teal)] font-medium"
                  >
                    <Play className="w-4 h-4" />
                    Watch Video
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpdatesSection;