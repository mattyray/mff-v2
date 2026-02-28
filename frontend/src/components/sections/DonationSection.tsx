import React, { useState } from 'react';
import { CreditCard, Shield, AlertCircle } from 'lucide-react';
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

  const quickAmounts = [25, 50, 100, 250, 500];

  if (!campaign) {
    return (
      <section className="section-spacing section-ocean-mist">
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
    const donationAmount = parseFloat(amount);
    if (!donationAmount || donationAmount < 1) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await DonationAPI.createDonation({
        ticket_quantity: 0,
        donation_amount: donationAmount,
        donor_name: isAnonymous ? '' : donorName,
        donor_email: isAnonymous ? '' : donorEmail,
        message,
        is_anonymous: isAnonymous
      });

      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Donation error:', err);
      setError(err.message || 'Payment setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="donate" className="section-spacing section-ocean-mist">
      <div className="container-custom">

        <div className="text-center mb-12">
          <h2 className="mb-4">Can't Make It? You Can Still Help</h2>
          <p className="text-xl text-[var(--ocean-driftwood)] max-w-2xl mx-auto">
            Even if you can't attend the event, you can still support Matt by donating online.
            Every dollar goes directly to his recovery fund.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card-ocean">

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Quick Amount Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--ocean-deep)] mb-3">
                Choose an amount:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
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
                  min="1"
                  className="input-ocean pl-8"
                />
              </div>
            </div>

            {/* Donor Info */}
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

            {/* Submit */}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
