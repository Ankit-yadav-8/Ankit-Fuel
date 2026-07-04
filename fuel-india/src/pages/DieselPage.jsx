import React from 'react';
import { Link } from 'react-router-dom';

const dieselStats = [
  { value: '6,200+', label: 'Diesel Stations' },
  { value: '450+', label: 'Highway Stops' },
  { value: '35%', label: 'Fleet Cost Savings' },
  { value: '24/7', label: 'Highway Availability' },
];

const features = [
  { icon: '🚚', title: 'Highway Diesel Hubs', desc: 'Find 24/7 highway diesel stations with heavy-vehicle access, wide entry points, and night parking facilities.' },
  { icon: '📊', title: 'Fleet Analytics', desc: 'Track your fleet\'s refueling costs, consumption patterns, and driver efficiency across all vehicles.' },
  { icon: '💳', title: 'Bulk Pricing', desc: 'Access wholesale diesel rates for your fleet. Negotiate directly with fuel companies through our platform.' },
  { icon: '🗺️', title: 'Multi-Stop Routes', desc: 'Plan multi-stop delivery routes with optimized diesel stops. Factor in truck restrictions and bridge heights.' },
  { icon: '📱', title: 'Driver App', desc: 'Give each driver a dedicated app to find stations, log refueling, and submit receipts automatically.' },
  { icon: '🔐', title: 'Fuel Card Integration', desc: 'Integrate with IOCL, BPCL, and HPCL fuel cards for seamless fleet payments and expense tracking.' },
];

const fleetBenefits = [
  { metric: '35%', label: 'Reduction in refueling downtime', icon: '⏱️' },
  { metric: '₹4.2L', label: 'Avg. annual savings per fleet', icon: '💰' },
  { metric: '18 min', label: 'Saved per stop with queue prediction', icon: '🤖' },
  { metric: '100%', label: 'Digital receipt compliance', icon: '📄' },
];

export default function DieselPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__grid">
            <div className="page-hero__content">
              <span className="hero__badge">🛢️ Diesel & Fleet Solutions</span>
              <h1 className="page-hero__title">Optimized Diesel Refueling for Commercial Fleets</h1>
              <p className="page-hero__subtitle">
                Highway diesel hubs, fleet management tools, bulk pricing, and AI-optimized refueling routes — designed for logistics, transport, and delivery companies.
              </p>
              <div className="page-hero__cta">
                <Link to="/route-planner" className="btn btn--primary btn--lg">Find Diesel Hubs ↗</Link>
                <Link to="/contact" className="btn btn--outline btn--lg">Fleet Demo</Link>
              </div>
            </div>
            <div className="page-hero__image">
              <img src="./images/diesel_fleet_1783050838517.png" alt="Diesel Fleet" />
            </div>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="container">
          <div className="stats-bar__grid">
            {dieselStats.map((stat) => (
              <div key={stat.label} className="stats-bar__item">
                <div className="stats-bar__value">{stat.value}</div>
                <div className="stats-bar__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Benefits */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Fleet Impact</span>
            <h2 className="section__title">Real Results for Real Fleets</h2>
            <p className="section__subtitle">Numbers from fleet operators who switched to Fuel-India for route optimization.</p>
          </div>
          <div className="impact-grid">
            {fleetBenefits.map((b) => (
              <div key={b.label} className="impact-card">
                <span className="impact-card__icon">{b.icon}</span>
                <div className="impact-card__metric">{b.metric}</div>
                <div className="impact-card__label">{b.label}</div>
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
            <h2 className="section__title">Enterprise-Grade Fleet Tools</h2>
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

      {/* Feature Row */}
      <section className="section">
        <div className="container">
          <div className="feature-row feature-row--reverse">
            <div className="feature-row__image">
              <img src="./images/route_planning.png" alt="Fleet Route" />
            </div>
            <div className="feature-row__content">
              <span className="feature-row__tag">ROUTE OPTIMIZATION</span>
              <h3 className="feature-row__title">Optimize Every Delivery Route</h3>
              <p className="feature-row__desc">
                Plan multi-stop delivery routes with diesel stops factored in. Our system considers truck weight restrictions, bridge clearances, and highway fuel availability.
              </p>
              <ul className="feature-row__list">
                <li>Multi-stop route optimization</li>
                <li>Heavy vehicle access verification</li>
                <li>Night parking availability</li>
                <li>Fuel card-compatible stations only</li>
              </ul>
              <Link to="/contact" className="btn btn--outline">Request Fleet Demo ↗</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-card__title">Cut Your Fleet's Fuel Costs This Quarter</h2>
            <p className="cta-card__desc">Book a 30-minute demo and see how much your routes could save with optimized diesel stops.</p>
            <div className="cta-card__actions">
              <Link to="/contact" className="btn btn--white btn--lg">Book a Fleet Demo</Link>
              <Link to="/route-planner" className="btn btn--outline btn--ghost btn--lg">Try the Route Planner</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
