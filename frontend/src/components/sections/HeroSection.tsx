import React, { useState, useEffect } from 'react';
import { ArrowDown, Play, Heart, Code2 } from 'lucide-react';
import type { Campaign } from '../../types/index';

interface HeroSectionProps {
  campaign: Campaign;
}

const HeroSection: React.FC<HeroSectionProps> = ({ campaign }) => {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animate numbers on mount
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      animateNumber(campaign.current_amount);
    }, 500);
    return () => clearTimeout(timer);
  }, [campaign.current_amount]);

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

  const handleLearnMoreClick = () => {
    document.getElementById('updates')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen overflow-hidden hero-ocean">
      {/* Simple Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent animate-pulse-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-20">
          
          {/* Left Content - Story */}
          <div className={`lg:w-1/2 lg:pr-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Heart className="w-4 h-4 text-[var(--ocean-sunrise)]" />
              <span className="text-white/90 text-sm font-medium">Supporting Matt's Journey</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-white mb-6 text-shadow-ocean">
              From Sea to 
              <span className="block text-[var(--ocean-seafoam)]">Source Code</span>
            </h1>

            {/* Updated Subtitle */}
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              I'm working diligently towards a life as a successful disabled person outside the nursing home. 
              My career is progressing every day, but I need your help raising money to renovate a bathroom 
              for my new apartment. It's the last thing standing in my way — your donations will help add 
              an element of security while I establish my new life.
            </p>

            {/* Story Hook */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <Code2 className="w-6 h-6 text-[var(--ocean-seafoam)] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">The Challenge</h3>
                  <p className="text-white/80 text-base">
                    {campaign.description}
                  </p>
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
                Support My Journey
              </button>
              
              <button 
                onClick={handleLearnMoreClick}
                className="btn-ocean-secondary bg-transparent border-white text-white hover:bg-white/10"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch My Story
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
                  ${campaign.goal_amount.toLocaleString()}
                </div>
                <div className="text-white/70 text-sm">Goal</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--ocean-sunrise)] mb-1">
                  {Math.round(campaign.progress_percentage)}%
                </div>
                <div className="text-white/70 text-sm">Complete</div>
              </div>
            </div>

          </div>

          {/* Right Content - Visual */}
          <div className={`lg:w-1/2 mt-12 lg:mt-0 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              
              {/* Main Image Container */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                {campaign.featured_image ? (
                  <img 
                    src={campaign.featured_image} 
                    alt="Matt Raynor - From fisherman to developer"
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex flex-col items-center justify-center text-white">
                    <div className="text-6xl mb-4">⚓</div>
                    <h3 className="text-2xl font-bold mb-2">Matt's Story</h3>
                    <p className="text-white/80 text-center max-w-xs">
                      From commercial fishing to coding — a journey of transformation
                    </p>
                  </div>
                )}
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-[var(--ocean-sunrise)] rounded-2xl p-4 animate-pulse-slow">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <div className="text-white text-sm font-medium">Self-taught</div>
                <div className="text-white/70 text-xs">Full-stack developer</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={() => document.getElementById('progress')?.scrollIntoView({ behavior: 'smooth' })}
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