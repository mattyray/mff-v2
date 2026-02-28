import React, { useState, useEffect, useRef } from 'react';
import { Gift, ExternalLink, Mail } from 'lucide-react';

const FACEBOOK_EVENT_URL = 'https://www.facebook.com/share/17yWU2jELE/';
const INSTAGRAM_URL = 'https://www.instagram.com/mattsfreedomfundraiser/';

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

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href={FACEBOOK_EVENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ocean-primary inline-flex items-center justify-center gap-2"
              >
                Facebook Event
                <ExternalLink className="w-5 h-5" />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ocean-secondary inline-flex items-center justify-center gap-2"
              >
                Follow on Instagram
                <ExternalLink className="w-5 h-5" />
              </a>
              <a
                href="mailto:mnraynor90@gmail.com"
                className="btn-ocean-secondary inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
            </div>

            {/* Cash Payment Note */}
            <div className="p-4 bg-[var(--ocean-mist)] rounded-xl mb-8">
              <p className="text-[var(--ocean-driftwood)] text-sm">
                <span className="font-semibold text-[var(--ocean-deep)]">Prefer to pay with cash?</span>{' '}
                Reach out on Instagram, Facebook, or email mnraynor90@gmail.com to arrange a cash ticket or donation.
              </p>
            </div>

            {/* Special Thanks */}
            <div className="pt-8 border-t border-gray-200">
              <p className="text-[var(--ocean-driftwood)] text-base">
                <span className="font-semibold text-[var(--ocean-deep)]">Special Thanks</span> to Alex Herzog for helping organize and plan this event, and to the Oakland Family and Sundays on the Bay for making it all happen.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default WantToHelpSection;
