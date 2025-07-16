import React, { useState } from 'react';
import { Heart, CreditCard, Shield, AlertCircle } from 'lucide-react';
import type { Campaign } from '../../types/index';

interface DonationSectionProps {
  campaign: Campaign;
}

const DonationSection: React.FC<DonationSectionProps> = ({ campaign }) => {
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const quickAmounts = [25, 50, 100, 250, 500, 1000];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) < 1) return;
    
    setLoading(true);
    try {
      // TODO: Integrate with Stripe
      console.log('Donation:', {
        amount: parseFloat(amount),
        donorName: isAnonymous ? '' : donorName,
        donorEmail: isAnonymous ? '' : donorEmail,
        message,
        isAnonymous
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Donation processing will be implemented with Stripe!');
    } catch (error) {
      console.error('Donation error:', error);
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
            <span className="text-[var(--ocean-blue)] text-sm font-medium">Make a Difference</span>
          </div>
          
          <h2 className="mb-4">Support My Journey</h2>
          <p className="text-xl text-[var(--ocean-driftwood)] max-w-2xl mx-auto">
            Every contribution helps me continue building, creating, and inspiring others
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card-ocean">
            
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
                    className={`py-3 px-4 rounded-xl border-2 transition-all duration-300 ${
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
                  onChange={(e) => setAmount(e.target.value)}
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
                  disabled={isAnonymous}
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
                  onChange={(e) => setDonorEmail(e.target.value)