import React, { useState, useEffect } from 'react';
import { ArrowDown, Heart, Calendar, MapPin, Clock } from 'lucide-react';
import type { Campaign } from '../../types/index';

interface HeroSectionProps {
  campaign: Campaign | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ campaign }) => {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Early return if no campaign data
  if (!campaign) {
    return (
      <section className="relative min-h-screen overflow-hidden hero-ocean flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading campaign...</p>
        </div>
      </section>
    );
  }

  // Animate numbers on mount
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      animateNumber(campaign?.current_amount || 0);
    }, 500);
    return () => clearTimeout(timer);
  }, [campaign?.current_amount]);

  const animateNumber = (target: number) => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCurrentAmount(target);
        clearInterval(timer);
      } else {
        setCurrentAmount(Math.floor(current));
      }
    }, stepDuration);
  };

  const handleDonateClick = () => {
    document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEventDetailsClick = () => {
    document.getElementById('event-details')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen overflow-hidden hero-ocean">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent animate-pulse-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-20">

          {/* Left Content */}
          <div className={`lg:w-1/2 lg:pr-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Calendar className="w-4 h-4 text-[var(--ocean-sunrise)]" />
              <span className="text-white/90 text-sm font-medium">Save the Date — April 11, 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-white mb-2 text-shadow-ocean">
              Matt's Freedom
              <span className="block text-[var(--ocean-seafoam)]">Fundraiser</span>
            </h1>

            <h3 className="text-white/90 font-semibold mb-6">1st Annual Silent Auction</h3>

            {/* Description */}
            <div className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed" style={{color: 'rgba(255, 255, 255, 0.95)'}}>
              <p className="mb-4">
                A community fundraiser to support Matt Raynor, a Hampton Bays commercial fisherman
                who became tetraplegic after a spinal cord injury. Live music, a silent auction,
                50/50 raffle, food, drinks, kids activities, and a night of community.
              </p>
              <p>
                Every dollar raised goes directly to Matt's recovery fund — helping cover the daily
                costs of living with a spinal cord injury that most people never think about.
              </p>
            </div>

            {/* Event Quick Facts */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[var(--ocean-seafoam)] flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold text-sm">Saturday</div>
                    <div className="text-white/70 text-sm">April 11, 2026</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[var(--ocean-seafoam)] flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold text-sm">5:00 – 8:00 PM</div>
                    <div className="text-white/70 text-sm">Doors Open at 5</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[var(--ocean-seafoam)] flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold text-sm">Sundays on the Bay</div>
                    <div className="text-white/70 text-sm">Hampton Bays, NY</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleDonateClick}
                className="btn-ocean-primary bg-white text-[var(--ocean-blue)] hover:bg-[var(--ocean-mist)] shadow-2xl"
              >
                <Heart className="w-5 h-5 mr-2" />
                Donate Now
              </button>

              <button
                onClick={handleEventDetailsClick}
                className="btn-ocean-secondary bg-transparent border-white text-white hover:bg-white/10"
              >
                Event Details
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold text-white mb-1 transition-all duration-1000 ${isVisible ? 'animate-count-up' : ''}`}>
                  ${currentAmount.toLocaleString()}
                </div>
                <div className="text-white/70 text-sm">Raised</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  ${(campaign?.goal_amount || 0).toLocaleString()}
                </div>
                <div className="text-white/70 text-sm">Goal</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--ocean-sunrise)] mb-1">
                  Apr 11
                </div>
                <div className="text-white/70 text-sm">Event Day</div>
              </div>
            </div>

          </div>

          {/* Right Content — Hero Image */}
          <div className={`lg:w-1/2 mt-12 lg:mt-0 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                {campaign?.featured_image ? (
                  <img
                    src={campaign.featured_image}
                    alt="Matt's Freedom Fundraiser — 1st Annual Silent Auction"
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                ) : (
                  <img
                    src="/images/hero-selfie.jpeg"
                    alt="Matt Raynor — Save the Date"
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                )}
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-[var(--ocean-sunrise)] rounded-2xl p-4 animate-pulse-slow">
                <Calendar className="w-8 h-8 text-white" />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <div className="text-white text-sm font-medium">April 11, 2026</div>
                <div className="text-white/70 text-xs">Save the Date</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => document.getElementById('event-details')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-white/60 hover:text-white transition-colors"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>

      {/* Wave Transition */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSection;
