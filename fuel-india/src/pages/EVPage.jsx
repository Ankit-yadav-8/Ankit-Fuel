import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🔍', title: 'Find Chargers Instantly', desc: 'Locate CCS, CHAdeMO, Type 2, and Tesla chargers across India with real-time availability status.' },
  { icon: '💳', title: 'Seamless Payments', desc: 'Pay across multiple charging networks through one unified wallet. No more juggling 10 different apps.' },
  { icon: '🗺️', title: 'Route Planning', desc: 'Plan your EV journey with automatic charging stop suggestions based on your battery range and charger availability.' },
  { icon: '🏠', title: 'Home Charging', desc: 'Smart home charging solutions. Schedule charging during off-peak hours and optimize your electricity costs.' },
  { icon: '🚚', title: 'Fleet Management', desc: 'Enterprise-grade fleet charging management. Track costs, schedule sessions, and manage drivers from one dashboard.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Track your charging history, costs, carbon savings, and compare prices across different charging providers.' },
];

const chargerTypes = [
  { type: 'CCS', power: 'Up to 350 kW', speed: '80% in 20 min', color: '#10B981' },
  { type: 'CHAdeMO', power: 'Up to 100 kW', speed: '80% in 45 min', color: '#3B82F6' },
  { type: 'Type 2', power: 'Up to 22 kW', speed: 'Full in 4-6 hrs', color: '#8B5CF6' },
  { type: 'GB/T', power: 'Up to 250 kW', speed: '80% in 25 min', color: '#F59E0B' },
];

const evStats = [
  { value: '2,500+', label: 'EV Chargers Listed' },
  { value: '180+', label: 'Cities Covered' },
  { value: '99.2%', label: 'Uptime Accuracy' },
  { value: '4.8★', label: 'User Rating' },
];

export default function EVPage() {
  return (
    <div className="page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__grid">
            <div className="page-hero__content">
              <span className="hero__badge">⚡ EV Charging Network</span>
              <h1 className="page-hero__title">
                Smart and Convenient Charging At Home, on the Go, and Beyond
              </h1>
              <p className="page-hero__subtitle">
                The ultimate EV charging companion. Find public chargers, plan routes, charge at home or on the go, and pay seamlessly across networks, all in one app.
              </p>
              <div className="page-hero__cta">
                <Link to="/route-planner" className="btn btn--primary btn--lg">Find Chargers ↗</Link>
                <Link to="/ev/fleet" className="btn btn--outline btn--lg">Fleet Solutions</Link>
              </div>
            </div>
            <div className="page-hero__image">
              <img src="/images/ev_charging_1783050805744.png" alt="EV Charging" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-bar__grid">
            {evStats.map((stat) => (
              <div key={stat.label} className="stats-bar__item">
                <div className="stats-bar__value">{stat.value}</div>
                <div className="stats-bar__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charger Types */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Charger Types</span>
            <h2 className="section__title">All Charger Standards, One Platform</h2>
            <p className="section__subtitle">We support every major EV charging standard available in India.</p>
          </div>
          <div className="charger-grid">
            {chargerTypes.map((c) => (
              <div key={c.type} className="charger-card" style={{ '--accent': c.color }}>
                <div className="charger-card__header">
                  <span className="charger-card__type">{c.type}</span>
                  <span className="charger-card__dot" />
                </div>
                <div className="charger-card__power">{c.power}</div>
                <div className="charger-card__speed">{c.speed}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Features</span>
            <h2 className="section__title">Everything You Need for EV Charging</h2>
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

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-card__title">Start Your EV Journey Today</h2>
            <p className="cta-card__desc">Join thousands of EV owners who charge smarter with Fuel-India.</p>
            <div className="cta-card__actions">
              <Link to="/route-planner" className="btn btn--primary btn--lg">Find Chargers Near Me</Link>
              <Link to="/contact" className="btn btn--white btn--lg">Partner With Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
