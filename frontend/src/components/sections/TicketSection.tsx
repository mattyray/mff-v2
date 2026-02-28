import React, { useState } from 'react';
import { Minus, Plus, CreditCard, Shield, AlertCircle, Heart } from 'lucide-react';
import { DonationAPI } from '../../services/api';
import type { Campaign } from '../../types/index';

interface TicketSectionProps {
  campaign: Campaign | null;
}

const TICKET_PRICE = 50;

const TicketSection: React.FC<TicketSectionProps> = ({ campaign }) => {
  const [ticketQuantity, setTicketQuantity] = useState(0);
  const [showDonation, setShowDonation] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!campaign) {
    return (
      <section className="section-spacing bg-white">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--ocean-blue)] mx-auto"></div>
        </div>
      </section>
    );
  }

  const extraDonation = parseFloat(donationAmount) || 0;
  const ticketSubtotal = ticketQuantity * TICKET_PRICE;
  const grandTotal = ticketSubtotal + extraDonation;

  const handleCheckout = async () => {
    if (ticketQuantity === 0) {
      setError('Please select at least one ticket.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await DonationAPI.createDonation({
        ticket_quantity: ticketQuantity,
        donation_amount: extraDonation,
        donor_name: isAnonymous ? '' : donorName,
        donor_email: isAnonymous ? '' : donorEmail,
        message,
        is_anonymous: isAnonymous,
      });

      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Payment setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tickets" className="section-spacing bg-white">
      <div className="container-custom">

        {/* Compact Progress */}
        <div className="max-w-2xl mx-auto mb-4">
          <div className="flex items-center justify-between text-sm text-[var(--ocean-driftwood)] mb-2">
            <span><span className="font-semibold text-[var(--ocean-deep)]">${(campaign.current_amount || 0).toLocaleString()}</span> raised of ${(campaign.goal_amount || 0).toLocaleString()}</span>
            <span><span className="font-semibold text-[var(--ocean-deep)]">{campaign.tickets_sold || 0}</span> tickets sold</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--ocean-blue)] to-[var(--ocean-teal)] rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, ((campaign.current_amount || 0) / (campaign.goal_amount || 1)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="mb-4">Get Your Tickets</h2>
          <p className="text-xl text-[var(--ocean-driftwood)] max-w-2xl mx-auto">
            Tickets are $50 each and include live music, silent auction, 50/50 raffle, food & drinks.
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

            {/* Ticket Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-[var(--ocean-deep)] mb-4">
                Number of Tickets — $50 each
              </label>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setTicketQuantity(Math.max(0, ticketQuantity - 1))}
                  disabled={ticketQuantity === 0 || loading}
                  className="w-14 h-14 rounded-xl border-2 border-gray-200 hover:border-[var(--ocean-blue)] flex items-center justify-center disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="text-5xl font-bold text-[var(--ocean-deep)] w-20 text-center tabular-nums">
                  {ticketQuantity}
                </div>
                <button
                  onClick={() => setTicketQuantity(ticketQuantity + 1)}
                  disabled={loading}
                  className="w-14 h-14 rounded-xl border-2 border-gray-200 hover:border-[var(--ocean-blue)] flex items-center justify-center transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {ticketQuantity > 0 && (
                <div className="text-center mt-4 text-[var(--ocean-driftwood)]">
                  {ticketQuantity} ticket{ticketQuantity !== 1 ? 's' : ''} &times; $50 = <span className="font-semibold text-[var(--ocean-deep)]">${ticketSubtotal}</span>
                </div>
              )}
            </div>

            {/* Optional Donation Add-on */}
            <div className="mb-8 border-t border-gray-100 pt-6">
              <button
                onClick={() => setShowDonation(!showDonation)}
                className="flex items-center gap-2 text-[var(--ocean-blue)] text-sm font-medium hover:text-[var(--ocean-teal)] transition-colors"
              >
                <Heart className="w-4 h-4" />
                {showDonation ? 'Hide donation' : 'Want to also make a donation?'}
              </button>
              {showDonation && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-[var(--ocean-deep)] mb-2">
                    Additional donation amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ocean-driftwood)]">$</span>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      disabled={loading}
                      placeholder="0.00"
                      min="0"
                      className="input-ocean pl-8"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Grand Total */}
            {grandTotal > 0 && (
              <div className="mb-8 p-4 bg-[var(--ocean-mist)] rounded-xl text-center">
                <div className="text-sm text-[var(--ocean-driftwood)] mb-1">Total</div>
                <div className="text-3xl font-bold text-[var(--ocean-blue)]">${grandTotal.toFixed(2)}</div>
                {ticketQuantity > 0 && extraDonation > 0 && (
                  <div className="text-xs text-[var(--ocean-driftwood)] mt-1">
                    {ticketQuantity} ticket{ticketQuantity !== 1 ? 's' : ''} (${ticketSubtotal}) + ${extraDonation.toFixed(2)} donation
                  </div>
                )}
              </div>
            )}

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
                  Keep my name anonymous
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleCheckout}
              disabled={ticketQuantity === 0 || loading}
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
                  Get Tickets — ${grandTotal.toFixed(2)}
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

export default TicketSection;
