import React from 'react';
import { Link } from 'react-router-dom';

const cngStats = [
  { value: '3,800+', label: 'CNG Stations' },
  { value: '250+', label: 'Cities' },
  { value: '15 min', label: 'Avg Queue Saved' },
  { value: '₹75.61', label: 'Avg CNG Price/kg' },
];

const features = [
  { icon: '📍', title: 'Find CNG Stations', desc: 'Locate the nearest CNG pumps with real-time availability. Filter by brand, pressure level, and opening hours.' },
  { icon: '⏱️', title: 'Live Queue Updates', desc: 'Community-reported queue lengths updated every few minutes. Know exactly how long you\'ll wait before you go.' },
  { icon: '🤖', title: 'AI Queue Prediction', desc: 'Our AI analyzes historical patterns, time of day, and seasonal trends to predict wait times with 92% accuracy.' },
  { icon: '💰', title: 'Price Tracking', desc: 'Track CNG prices across cities. Get notified when prices change in your area.' },
  { icon: '🗺️', title: 'Route-Based Search', desc: 'Planning a highway trip? Find CNG stations along your route with the shortest queues.' },
  { icon: '🏆', title: 'Earn Rewards', desc: 'Report queue lengths and earn reward points. Redeem them for fuel vouchers and partner offers.' },
];

const cities = [
  { name: 'Delhi NCR', stations: 850, price: '₹75.61/kg' },
  { name: 'Mumbai', stations: 420, price: '₹76.00/kg' },
  { name: 'Ahmedabad', stations: 380, price: '₹72.00/kg' },
  { name: 'Pune', stations: 210, price: '₹76.00/kg' },
  { name: 'Lucknow', stations: 180, price: '₹73.00/kg' },
  { name: 'Bangalore', stations: 95, price: '₹73.50/kg' },
  { name: 'Indore', stations: 85, price: '₹73.50/kg' },
  { name: 'Surat', stations: 120, price: '₹72.50/kg' },
];

export default function CNGPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__grid">
            <div className="page-hero__content">
              <span className="hero__badge">🟢 CNG Station Network</span>
              <h1 className="page-hero__title">Never Wait in a CNG Queue Again</h1>
              <p className="page-hero__subtitle">
                Real-time queue reports, AI-powered predictions, and the most comprehensive CNG station database in India. Save 15+ minutes on every refill.
              </p>
              <div className="page-hero__cta">
                <Link to="/route-planner" className="btn btn--primary btn--lg">Find CNG Stations ↗</Link>
                <Link to="/cng/queue" className="btn btn--outline btn--lg">Check Queues</Link>
              </div>
            </div>
            <div className="page-hero__image">
              <img src="/images/cng_pump_1783050817670.png" alt="CNG Station" />
            </div>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="container">
          <div className="stats-bar__grid">
            {cngStats.map((stat) => (
              <div key={stat.label} className="stats-bar__item">
                <div className="stats-bar__value">{stat.value}</div>
                <div className="stats-bar__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Queue Prediction Works */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">How It Works</span>
            <h2 className="section__title">AI-Powered Queue Prediction</h2>
            <p className="section__subtitle">Three steps to skip the CNG queue forever.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-card__number">01</div>
              <h4 className="step-card__title">Community Reports</h4>
              <p className="step-card__desc">Users report queue lengths at CNG stations in real-time. Each report earns reward points.</p>
            </div>
            <div className="step-card__connector">→</div>
            <div className="step-card">
              <div className="step-card__number">02</div>
              <h4 className="step-card__title">AI Analysis</h4>
              <p className="step-card__desc">Our AI processes reports alongside time patterns, holiday data, and historical trends.</p>
            </div>
            <div className="step-card__connector">→</div>
            <div className="step-card">
              <div className="step-card__number">03</div>
              <h4 className="step-card__title">Smart Recommendation</h4>
              <p className="step-card__desc">"Skip station A (20 min wait). Drive 2 km to station B (3 min wait)."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Features</span>
            <h2 className="section__title">Everything for CNG Drivers</h2>
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

      {/* City Coverage */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Coverage</span>
            <h2 className="section__title">CNG Station Coverage Across India</h2>
          </div>
          <div className="city-grid">
            {cities.map((city) => (
              <div key={city.name} className="city-card">
                <h4 className="city-card__name">{city.name}</h4>
                <div className="city-card__stats">
                  <span className="city-card__stat">{city.stations} stations</span>
                  <span className="city-card__price">{city.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-card__title">Start Saving Time on CNG Refills</h2>
            <p className="cta-card__desc">Join the community and never wait in a CNG queue blindly again.</p>
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
