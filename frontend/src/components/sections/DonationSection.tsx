import React, { useState } from 'react';
import type { Campaign } from '../../types/index';

interface DonationSectionProps {
  campaign: Campaign;
}

const DonationSection: React.FC<DonationSectionProps> = ({ campaign }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [25, 50, 100, 250, 500];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) < 1) return;
    
    setLoading(true);
    // TODO: Integrate with Stripe
    console.log('Donating:', amount);
    setLoading(false);
  };

  return (
    <section id="donate" className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Support Matt's Journey</h2>
          <p className="text-gray-600">
            Every contribution helps Matt achieve independence and continue inspiring others
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8">
          {/* Quick amount buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose an amount:
            </label>
            <div className="grid grid-cols-5 gap-3">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  onClick={() => handleQuickAmount(value)}
                  className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                    amount === value.toString()
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  ${value}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Or enter custom amount:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Donate button */}
          <button
            onClick={handleDonate}
            disabled={!amount || parseFloat(amount) < 1 || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-4 rounded-lg transition-colors"
          >
            {loading ? 'Processing...' : `Donate $${amount || '0'}`}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Secure payment processing powered by Stripe
          </p>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;