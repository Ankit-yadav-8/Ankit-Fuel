import React from 'react';
import { Link } from 'react-router-dom';

const petrolStats = [
  { value: '8,500+', label: 'Petrol Stations' },
  { value: '500+', label: 'Cities' },
  { value: '₹2.50', label: 'Avg Savings/Litre' },
  { value: '4.2★', label: 'Avg Rating' },
];

const features = [
  { icon: '📍', title: 'Station Finder', desc: 'Find the nearest petrol stations with amenities like restrooms, ATMs, food courts, and air pressure.' },
  { icon: '💰', title: 'Price Comparison', desc: 'Compare petrol prices across nearby stations. Community-reported prices updated daily.' },
  { icon: '⭐', title: 'Ratings & Reviews', desc: 'Read genuine reviews from other drivers. Filter stations by rating, brand, and amenities.' },
  { icon: '🗺️', title: 'Highway Route Planning', desc: 'Plan your highway trip with optimized petrol stops. Never run on empty on a long drive.' },
  { icon: '🔔', title: 'Price Alerts', desc: 'Set alerts for price drops in your city. Get notified when fuel prices change.' },
  { icon: '📸', title: 'Photo Updates', desc: 'See real photos of stations uploaded by the community. Know exactly what to expect.' },
];

const brands = [
  { name: 'Indian Oil (IOCL)', stations: '34,000+', share: '42%' },
  { name: 'Bharat Petroleum (BPCL)', stations: '20,000+', share: '25%' },
  { name: 'Hindustan Petroleum (HPCL)', stations: '21,000+', share: '26%' },
  { name: 'Shell', stations: '350+', share: '0.4%' },
  { name: 'Reliance BP', stations: '1,400+', share: '1.7%' },
  { name: 'Nayara Energy', stations: '6,500+', share: '8%' },
];

export default function PetrolPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__grid">
            <div className="page-hero__content">
              <span className="hero__badge">⛽ Petrol Station Network</span>
              <h1 className="page-hero__title">Find the Best Petrol Stations, Save on Every Litre</h1>
              <p className="page-hero__subtitle">
                Compare prices, check amenities, read reviews, and discover the best petrol stations on your route. AI-powered recommendations that save you money.
              </p>
              <div className="page-hero__cta">
                <Link to="/route-planner" className="btn btn--primary btn--lg">Find Stations ↗</Link>
                <Link to="/petrol/prices" className="btn btn--outline btn--lg">Check Prices</Link>
              </div>
            </div>
            <div className="page-hero__image">
              <img src="/images/petrol_station_1783050827829.png" alt="Petrol Station" />
            </div>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="container">
          <div className="stats-bar__grid">
            {petrolStats.map((stat) => (
              <div key={stat.label} className="stats-bar__item">
                <div className="stats-bar__value">{stat.value}</div>
                <div className="stats-bar__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendation Example */}
      <section className="section">
        <div className="container">
          <div className="feature-row">
            <div className="feature-row__image">
              <img src="/images/route_planning.png" alt="AI Recommendation" />
            </div>
            <div className="feature-row__content">
              <span className="feature-row__tag">AI RECOMMENDATIONS</span>
              <h3 className="feature-row__title">Don't Just Find the Nearest — Find the Best</h3>
              <p className="feature-row__desc">
                Our AI doesn't just show you the nearest station. It ranks stations based on price, queue length, ratings, amenities, and your vehicle type.
              </p>
              <div className="ai-example">
                <div className="ai-example__bubble">
                  <span className="ai-example__icon">🤖</span>
                  <p>"Skip HP Station ahead (₹96.50/L, 12 min queue). Drive 3 km further to Indian Oil (₹94.72/L, no queue). <strong>Save ₹2.50/L and 12 minutes.</strong>"</p>
                </div>
              </div>
              <Link to="/route-planner" className="btn btn--outline">Try AI Recommendations ↗</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Features</span>
            <h2 className="section__title">Smarter Petrol Station Discovery</h2>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <span className="feature-card__icon">{f.icon}</span>
                <h4 className="feature-card__title">{f.title}</h4>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Brands</span>
            <h2 className="section__title">All Major Fuel Brands Covered</h2>
          </div>
          <div className="brand-grid">
            {brands.map((b) => (
              <div key={b.name} className="brand-card">
                <h4 className="brand-card__name">{b.name}</h4>
                <div className="brand-card__info">
                  <span>{b.stations} stations</span>
                  <span className="brand-card__share">{b.share} market share</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-card__title">Start Saving on Petrol Today</h2>
            <p className="cta-card__desc">Compare prices, skip queues, and get AI recommendations for every refuel.</p>
            <div className="cta-card__actions">
              <Link to="/route-planner" className="btn btn--primary btn--lg">Get Started Free</Link>
              <Link to="/contact" className="btn btn--white btn--lg">List Your Station</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
