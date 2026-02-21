import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Music, Gavel, Ticket, UtensilsCrossed } from 'lucide-react';

const EventDetailsSection: React.FC = () => {
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

  const activities = [
    { icon: Music, label: 'Live Music', description: 'Local bands performing throughout the evening' },
    { icon: Gavel, label: 'Silent Auction', description: 'Bid on items donated by local businesses' },
    { icon: Ticket, label: '50/50 Raffle', description: 'Buy a ticket for a chance to win big' },
    { icon: UtensilsCrossed, label: 'Food & Drinks', description: 'Great food and drinks all night' },
  ];

  return (
    <section id="event-details" ref={sectionRef} className="section-spacing bg-white">
      <div className="container-custom">

        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-[var(--ocean-blue)]/10 rounded-full px-4 py-2 mb-4">
            <Calendar className="w-4 h-4 text-[var(--ocean-blue)]" />
            <span className="text-[var(--ocean-blue)] text-sm font-medium">Event Details</span>
          </div>
          <h2 className="mb-4">Join Us</h2>
          <p className="text-xl text-[var(--ocean-driftwood)] max-w-2xl mx-auto">
            A night of community, live music, and giving back — all for a great cause.
          </p>
        </div>

        {/* When & Where Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* When */}
          <div className="card-ocean text-center">
            <div className="w-14 h-14 bg-[var(--ocean-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-7 h-7 text-[var(--ocean-blue)]" />
            </div>
            <h3 className="text-[var(--ocean-deep)] mb-2">When</h3>
            <p className="text-xl font-semibold text-[var(--ocean-blue)] mb-1">Saturday, April 11, 2026</p>
            <p className="text-lg text-[var(--ocean-driftwood)]">5:00 PM – 8:00 PM</p>
          </div>

          {/* Where */}
          <div className="card-ocean text-center">
            <div className="w-14 h-14 bg-[var(--ocean-teal)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-[var(--ocean-teal)]" />
            </div>
            <h3 className="text-[var(--ocean-deep)] mb-2">Where</h3>
            <p className="text-xl font-semibold text-[var(--ocean-blue)] mb-1">Sundays on the Bay</p>
            <p className="text-lg text-[var(--ocean-driftwood)]">369 Dune Road, Hampton Bays, NY 11946</p>
          </div>
        </div>

        {/* What to Expect */}
        <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-center text-[var(--ocean-deep)] mb-8">What to Expect</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {activities.map((activity) => (
              <div key={activity.label} className="text-center group">
                <div className="w-16 h-16 bg-[var(--ocean-mist)] group-hover:bg-[var(--ocean-blue)]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
                  <activity.icon className="w-8 h-8 text-[var(--ocean-blue)]" />
                </div>
                <h4 className="text-[var(--ocean-deep)] text-base font-semibold mb-1">{activity.label}</h4>
                <p className="text-[var(--ocean-driftwood)] text-sm">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default EventDetailsSection;
