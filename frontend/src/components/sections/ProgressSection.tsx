import React from 'react';
import type { Campaign } from '../../types/index';

interface ProgressSectionProps {
  campaign: Campaign;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ campaign }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Campaign Progress</h2>
          <p className="text-gray-600">Every donation brings Matt closer to his goal</p>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">
              ${campaign.current_amount.toLocaleString()}
            </span>
            <span className="text-lg font-semibold text-gray-900">
              ${campaign.goal_amount.toLocaleString()}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(campaign.progress_percentage, 100)}%` }}
            ></div>
          </div>
          
          <div className="text-center">
            <span className="text-2xl font-bold text-blue-600">
              {Math.round(campaign.progress_percentage)}% Complete
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressSection;