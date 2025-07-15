import React from 'react';
import type { Campaign } from '../../types/index';

interface HeroSectionProps {
  campaign: Campaign;
}

const HeroSection: React.FC<HeroSectionProps> = ({ campaign }) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Matt's story */}
          <div>
            <div className="text-sm font-medium text-blue-600 mb-4">
              SUPPORT MATT'S JOURNEY
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {campaign.title}
            </h1>
            
            <div className="prose prose-lg text-gray-600 mb-8">
              <p className="text-xl mb-4">
                From commercial fisherman to self-taught developer after a life-changing diving accident.
              </p>
              <p>
                {campaign.description}
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${campaign.current_amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Raised</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${campaign.goal_amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Goal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(campaign.progress_percentage)}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <button 
                onClick={() => document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Support Matt
              </button>
              <button 
                onClick={() => document.getElementById('updates')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View Updates
              </button>
            </div>
          </div>

          {/* Right: Hero image placeholder */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              {campaign.featured_image ? (
                <img 
                  src={campaign.featured_image} 
                  alt="Matt Raynor"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="text-center text-blue-600">
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-lg font-medium">Matt's Photo</p>
                  <p className="text-sm">Coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;