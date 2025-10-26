import React, { useState, useEffect } from 'react';
import { ArrowDown, Play, Heart, Home } from 'lucide-react';
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

  // Extract YouTube video ID from various URL formats
  const extractVideoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
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
              <Home className="w-4 h-4 text-[var(--ocean-sunrise)]" />
              <span className="text-white/90 text-sm font-medium">The Last Mile</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-white mb-6 text-shadow-ocean">
              The Final Step to
              <span className="block text-[var(--ocean-seafoam)]">Independence</span>
            </h1>

            {/* Updated Subtitle with preserved line breaks */}
            <div className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed" style={{color: 'rgba(255, 255, 255, 0.95) !important'}}>
              <p className="mb-4">
                After two years of grinding and planning every detail, I'm finally moving out of the nursing home on November 3rd — back to my hometown, Hampton Bays. The bathroom renovation went perfectly, and we raised almost exactly what was needed.
              </p>
              <p className="mb-4">
                Now it's down to the last piece: care coverage. I've got amazing aides lined up, but the state is crawling through their paperwork. Only two are fully registered so far, which leaves me covering shifts out of pocket.
              </p>
              <p>
                This fundraiser bridges that gap — helping pay caregivers until the state catches up, and covering any surprise costs along the way. Your support gets me through this final stretch toward real independence in Hampton Bays.
              </p>
            </div>

            {/* Story Hook */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <Home className="w-6 h-6 text-[var(--ocean-seafoam)] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">We Are Almost There!</h3>
                  <p className="text-white/80 text-base">
                    Help support me by raising money for ongoing care support while I get adjusted, start working, and secure long-term care support.
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
                Support My Independence
              </button>
              
              <button 
                onClick={handleLearnMoreClick}
                className="btn-ocean-secondary bg-transparent border-white text-white hover:bg-white/10"
              >
                <Play className="w-5 h-5 mr-2" />
                Learn My Story
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
                  Nov 3rd
                </div>
                <div className="text-white/70 text-sm">Move Out</div>
              </div>
            </div>

          </div>

          {/* Right Content - Video/Visual */}
          <div className={`lg:w-1/2 mt-12 lg:mt-0 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              
              {/* Main Video/Image Container */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                {campaign?.featured_video_url && extractVideoId(campaign.featured_video_url) ? (
                  // Video embed
                  <div className="w-full h-96 rounded-2xl overflow-hidden bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractVideoId(campaign.featured_video_url)}?controls=1&modestbranding=1&rel=0`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                      title="Matthew's Journey to Independence"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : campaign?.featured_image ? (
                  // Image fallback
                  <img 
                    src={campaign.featured_image} 
                    alt="Matthew Raynor - The final step to independence"
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                ) : (
                  // Default fallback
                  <div className="w-full h-96 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex flex-col items-center justify-center text-white">
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className="text-2xl font-bold mb-2">The Last Mile</h3>
                    <p className="text-white/80 text-center max-w-xs">
                      From nursing home to independence – the final step of a two-year journey
                    </p>
                  </div>
                )}
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-[var(--ocean-sunrise)] rounded-2xl p-4 animate-pulse-slow">
                <Home className="w-8 h-8 text-white" />
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <div className="text-white text-sm font-medium">November 3rd</div>
                <div className="text-white/70 text-xs">Move-out day</div>
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