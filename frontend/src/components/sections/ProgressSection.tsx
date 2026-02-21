import React, { useState, useEffect, useRef } from 'react';
import { Target, TrendingUp, Users, Calendar } from 'lucide-react';
import type { Campaign } from '../../types/index';

interface ProgressSectionProps {
  campaign: Campaign | null;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ campaign }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  if (!campaign) {
    return (
      <section className="section-spacing section-ocean-mist">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--ocean-blue)] mx-auto"></div>
        </div>
      </section>
    );
  }

  // Intersection Observer for mobile
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('📍 Progress section intersection:', entry.isIntersecting, entry.intersectionRatio);
        
        if (entry.isIntersecting) {
          setIsVisible(true);
          const delay = isMobile ? 100 : 200;
          setTimeout(() => {
            animateProgress();
            animateAmount();
          }, delay);
        }
      },
      { 
        threshold: isMobile ? 0.05 : 0.3,
        rootMargin: isMobile ? '100px 0px' : '50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      console.log('📍 Progress section observer attached');
    }

    // Fallback timer
    const fallbackTimer = setTimeout(() => {
      if (!isVisible) {
        console.log('🔧 Fallback: Triggering progress animations');
        setIsVisible(true);
        animateProgress();
        animateAmount();
      }
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [isVisible]);

  const animateProgress = () => {
    const duration = 2000;
    const steps = 60;
    const increment = (campaign?.progress_percentage || 0) / steps;
    const stepDuration = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= (campaign?.progress_percentage || 0)) {
        setAnimatedProgress(campaign?.progress_percentage || 0);
        clearInterval(timer);
      } else {
        setAnimatedProgress(current);
      }
    }, stepDuration);
  };

  const animateAmount = () => {
    const duration = 2000;
    const steps = 60;
    const increment = (campaign?.current_amount || 0) / steps;
    const stepDuration = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= (campaign?.current_amount || 0)) {
        setAnimatedAmount(campaign?.current_amount || 0);
        clearInterval(timer);
      } else {
        setAnimatedAmount(Math.floor(current));
      }
    }, stepDuration);
  };

  const remainingAmount = (campaign?.goal_amount || 0) - (campaign?.current_amount || 0);

  return (
    <section id="progress" ref={sectionRef} className="section-spacing section-ocean-mist">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-[var(--ocean-blue)]/10 rounded-full px-4 py-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[var(--ocean-blue)]" />
            <span className="text-[var(--ocean-blue)] text-sm font-medium">Fundraising Progress</span>
          </div>

          <h2 className="mb-4">Every Dollar Counts</h2>
          <p className="text-xl text-[var(--ocean-driftwood)] max-w-2xl mx-auto">
            Every donation goes directly to Matt's recovery fund — covering the daily costs of living
            with a spinal cord injury that most people never think about.
          </p>
        </div>

        {/* Main Progress Card */}
        <div className={`card-ocean max-w-4xl mx-auto mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Progress Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h3 className="text-[var(--ocean-deep)] mb-2">Campaign Progress</h3>
              <p className="text-[var(--ocean-driftwood)]">
                Help us reach our goal for the 1st Annual Silent Auction
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 text-right">
              <div className="text-3xl font-bold text-[var(--ocean-blue)]">
                ${animatedAmount.toLocaleString()}
              </div>
              <div className="text-[var(--ocean-driftwood)] text-sm">
                of ${(campaign?.goal_amount || 0).toLocaleString()} goal
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-[var(--ocean-deep)]">
                {Math.round(animatedProgress)}% Complete
              </span>
              <span className="text-sm text-[var(--ocean-driftwood)]">
                ${remainingAmount.toLocaleString()} remaining
              </span>
            </div>
            
            <div className="progress-ocean">
              <div 
                className="progress-ocean-fill"
                style={{ width: `${animatedProgress}%` }}
              />
            </div>
          </div>

          {/* Impact Statement */}
          <div className="bg-[var(--ocean-mist)] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Target className="w-6 h-6 text-[var(--ocean-blue)] mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-[var(--ocean-deep)] mb-2">Where Your Money Goes</h4>
                <p className="text-[var(--ocean-driftwood)] mb-4">
                  Every dollar raised goes directly to Matt's recovery fund — helping cover the daily costs
                  of living with a spinal cord injury that most people never think about.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--ocean-blue)] rounded-full"></div>
                    <span className="text-sm text-[var(--ocean-driftwood)]">Daily care & caregiver support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--ocean-teal)] rounded-full"></div>
                    <span className="text-sm text-[var(--ocean-driftwood)]">Medical equipment & supplies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--ocean-seafoam)] rounded-full"></div>
                    <span className="text-sm text-[var(--ocean-driftwood)]">Accessible housing costs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--ocean-sunrise)] rounded-full"></div>
                    <span className="text-sm text-[var(--ocean-driftwood)]">Independence & quality of life</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Event Date */}
          <div className="card-ocean text-center">
            <div className="w-12 h-12 bg-[var(--ocean-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-[var(--ocean-blue)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--ocean-deep)] mb-2">
              April 11
            </div>
            <div className="text-[var(--ocean-driftwood)] text-sm">
              Event Day
            </div>
          </div>

          {/* Goal */}
          <div className="card-ocean text-center">
            <div className="w-12 h-12 bg-[var(--ocean-teal)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-[var(--ocean-teal)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--ocean-deep)] mb-2">
              $10,000
            </div>
            <div className="text-[var(--ocean-driftwood)] text-sm">
              Fundraising Goal
            </div>
          </div>

          {/* Community */}
          <div className="card-ocean text-center">
            <div className="w-12 h-12 bg-[var(--ocean-sunrise)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-[var(--ocean-sunrise)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--ocean-deep)] mb-2">
              Hampton Bays
            </div>
            <div className="text-[var(--ocean-driftwood)] text-sm">
              Community Strong
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressSection;