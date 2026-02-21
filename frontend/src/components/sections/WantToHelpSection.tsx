import React, { useState, useEffect, useRef } from 'react';
import { Gift, ExternalLink } from 'lucide-react';

const FACEBOOK_EVENT_URL = 'https://www.facebook.com/events/877647888439782/';

const WantToHelpSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing bg-white">
      <div className="container-custom">
        <div className={`max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="card-ocean text-center bg-gradient-to-br from-[var(--ocean-mist)] to-white">

            <div className="w-16 h-16 bg-[var(--ocean-sunrise)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-8 h-8 text-[var(--ocean-sunrise)]" />
            </div>

            <h2 className="mb-4">Want to Help?</h2>
            <p className="text-xl text-[var(--ocean-driftwood)] mb-8 max-w-xl mx-auto">
              Donate an item for the silent auction or sponsor the event. Every contribution makes a difference.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={FACEBOOK_EVENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ocean-primary inline-flex items-center justify-center gap-2"
              >
                Facebook Event Page
                <ExternalLink className="w-5 h-5" />
              </a>
              <a
                href="mailto:mnraynor90@gmail.com"
                className="btn-ocean-secondary inline-flex items-center justify-center gap-2"
              >
                Get in Touch
              </a>
            </div>

            {/* Special Thanks */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <p className="text-[var(--ocean-driftwood)] text-base">
                <span className="font-semibold text-[var(--ocean-deep)]">Special Thanks</span> to the Oakland Family and Sundays on the Bay for making this possible.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default WantToHelpSection;
