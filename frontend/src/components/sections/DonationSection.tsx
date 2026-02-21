import React, { useState } from 'react';
import { Heart, CreditCard, Shield, AlertCircle } from 'lucide-react';
import { DonationAPI } from '../../services/api';
import type { Campaign } from '../../types/index';

interface DonationSectionProps {
  campaign: Campaign | null;
}

const DonationSection: React.FC<DonationSectionProps> = ({ campaign }) => {
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const quickAmounts = [25, 50, 100, 250, 500, 1000];

  if (!campaign) {
    return (
      <section className="section-spacing bg-white">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--ocean-blue)] mx-auto"></div>
        </div>
      </section>
    );
  }

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setError('');
  };

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) < 1) {
      setError('Please enter a valid amount');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await DonationAPI.createDonation({
        amount: parseFloat(amount),
        donor_name: isAnonymous ? '' : donorName,
        donor_email: isAnonymous ? '' : donorEmail,
        message,
        is_anonymous: isAnonymous
      });
      
      // Redirect to Stripe Checkout
      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }
      
    } catch (error: any) {
      console.error('Donation error:', error);
      setError(error.message || 'Payment setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="donate" className="section-spacing bg-white">
      <div className="container-custom">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[var(--ocean-blue)]/10 rounded-full px-4 py-2 mb-4">
            <Heart className="w-4 h-4 text-[var(--ocean-blue)]" />
            <span className="text-[var(--ocean-blue)] text-sm font-medium">Support Matt</span>
          </div>

          <h2 className="mb-4">Make a Donation</h2>
          <p className="text-xl text-[var(--ocean-driftwood)] max-w-2xl mx-auto">
            Can't make it to the event? You can still support Matt by donating online.
            Every dollar goes directly to his recovery fund.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card-ocean">
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Impact Preview */}
            <div className="mb-6 p-4 bg-[var(--ocean-mist)] rounded-xl">
              <h4 className="text-[var(--ocean-deep)] font-semibold mb-2">Your Impact</h4>
              <p className="text-[var(--ocean-driftwood)] text-sm mb-3">
                Matt became tetraplegic after a spinal cord injury. Your donation helps cover the daily
                costs of recovery and independence that most people never think about.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Daily care support</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span>Medical equipment</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Accessible housing</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>Quality of life</span>
                </div>
              </div>
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--ocean-deep)] mb-3">
                Choose an amount:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleQuickAmount(value)}
                    disabled={loading}
                    className={`py-3 px-4 rounded-xl border-2 transition-all duration-300 disabled:opacity-50 ${
                      amount === value.toString()
                        ? 'border-[var(--ocean-blue)] bg-[var(--ocean-blue)]/10 text-[var(--ocean-blue)]'
                        : 'border-gray-200 hover:border-[var(--ocean-blue)]/50'
                    }`}
                  >
                    ${value}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--ocean-deep)] mb-2">
                Or enter custom amount:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ocean-driftwood)]">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError('');
                  }}
                  disabled={loading}
                  placeholder="0.00"
                  className="input-ocean pl-8"
                />
              </div>
            </div>

            {/* Donor Information */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[var(--ocean-deep)] mb-1">
                  Full Name (optional)
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  disabled={isAnonymous || loading}
                  placeholder="Your name"
                  className={`input-ocean ${isAnonymous ? 'opacity-50' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--ocean-deep)] mb-1">
                  Email Address (optional)
                </label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  disabled={isAnonymous || loading}
                  placeholder="your@email.com"
                  className={`input-ocean ${isAnonymous ? 'opacity-50' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--ocean-deep)] mb-1">
                  Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                  placeholder="Share a message of support for Matt..."
                  rows={3}
                  className="input-ocean resize-none"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  disabled={loading}
                  className="w-5 h-5 text-[var(--ocean-blue)] border-gray-300 rounded focus:ring-[var(--ocean-blue)]"
                />
                <span className="text-[var(--ocean-deep)] text-sm">
                  Make this donation anonymous
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleDonate}
              disabled={!amount || parseFloat(amount) < 1 || loading}
              className={`w-full btn-ocean-primary text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Donate ${amount || '0'}
                </div>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[var(--ocean-driftwood)]">
              <Shield className="w-4 h-4" />
              Secure payment processing by Stripe
            </div>

            {/* Additional Context */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-[var(--ocean-driftwood)] text-center">
                <strong>Any amount helps.</strong> Every dollar goes directly to Matt's recovery fund.
                Thank you for your generosity and support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;