import React, { useState, useEffect, useRef } from 'react';
import { Target, TrendingUp, Users, Calendar } from 'lucide-react';
import type { Campaign } from '../../types/index';

interface ProgressSectionProps {
  campaign: Campaign;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ campaign }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => {
            animateProgress();
            animateAmount();
          }, 200);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateProgress = () => {
    const duration = 2000;
    const steps = 60;
    const increment = campaign.progress_percentage / steps;
    const stepDuration = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= campaign.progress_percentage) {
        setAnimatedProgress(campaign.progress_percentage);
        clearInterval(timer);
      } else {
        setAnimatedProgress(current);
      }
    }, stepDuration);
  };

  const animateAmount = () => {
    const duration = 2000;
    const steps = 60;
    const increment = campaign.current_amount / steps;
    const stepDuration = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= campaign.current_amount) {
        setAnimatedAmount(campaign.current_amount);
        clearInterval(timer);
      } else {
        setAnimatedAmount(Math.floor(current));
      }
    }, stepDuration);
  };

  const remainingAmount = campaign.goal_amount - campaign.current_amount;

  return (
    <section id="progress" ref={sectionRef} className="section-spacing section-ocean-mist">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-[var(--ocean-blue)]/10 rounded-full px-4 py-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[var(--ocean-blue)]" />
            <span className="text-[var(--ocean-blue)] text-sm font-medium">Campaign Progress</span>
          </div>
          
          <h2 className="mb-4">Every Step Counts</h2>
          <p className="text-xl text-[var(--ocean-driftwood)] max-w-2xl mx-auto">
            Your support brings me closer to securing accessible housing and continuing to inspire others through technology
          </p>
        </div>

        {/* Main Progress Card */}
        <div className={`card-ocean max-w-4xl mx-auto mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Progress Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h3 className="text-[var(--ocean-deep)] mb-2">Current Progress</h3>
              <p className="text-[var(--ocean-driftwood)]">
                Help me reach the next milestone in my journey
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 text-right">
              <div className="text-3xl font-bold text-[var(--ocean-blue)]">
                ${animatedAmount.toLocaleString()}
              </div>
              <div className="text-[var(--ocean-driftwood)] text-sm">
                of ${campaign.goal_amount.toLocaleString()} goal
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
                <h4 className="text-[var(--ocean-deep)] mb-2">What This Funding Achieves</h4>
                <p className="text-[var(--ocean-driftwood)] mb-4">
                  This campaign will help me secure accessible housing that allows me to continue coding, 
                  creating content, and inspiring others in the disability community.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--ocean-blue)] rounded-full"></div>
                    <span className="text-sm text-[var(--ocean-driftwood)]">Accessible workspace setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--ocean-teal)] rounded-full"></div>
                    <span className="text-sm text-[var(--ocean-driftwood)]">Continued content creation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--ocean-seafoam)] rounded-full"></div>
                    <span className="text-sm text-[var(--ocean-driftwood)]">Community inspiration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--ocean-sunrise)] rounded-full"></div>
                    <span className="text-sm text-[var(--ocean-driftwood)]">Technology advocacy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Donation Count */}
          <div className="card-ocean text-center">
            <div className="w-12 h-12 bg-[var(--ocean-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-[var(--ocean-blue)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--ocean-deep)] mb-2">
              47
            </div>
            <div className="text-[var(--ocean-driftwood)] text-sm">
              Supporters
            </div>
          </div>

          {/* Average Donation */}
          <div className="card-ocean text-center">
            <div className="w-12 h-12 bg-[var(--ocean-teal)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-[var(--ocean-teal)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--ocean-deep)] mb-2">
              ${Math.round(campaign.current_amount / 47)}
            </div>
            <div className="text-[var(--ocean-driftwood)] text-sm">
              Average Gift
            </div>
          </div>

          {/* Time Remaining */}
          <div className="card-ocean text-center">
            <div className="w-12 h-12 bg-[var(--ocean-sunrise)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-[var(--ocean-sunrise)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--ocean-deep)] mb-2">
              Ongoing
            </div>
            <div className="text-[var(--ocean-driftwood)] text-sm">
              No deadline
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressSection;