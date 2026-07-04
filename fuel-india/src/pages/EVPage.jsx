import React from 'react';
import { Link } from 'react-router-dom';

export default function EVPage() {
  return (
    <div className="page">
      {/* Premium Hero Section */}
      <section className="hero-premium">
        <div className="container">
          <div className="hero-premium__grid">
            <div className="hero-premium__content">
              <div className="hero__badge">EV Charging Network</div>
              <h1 className="hero-premium__title">
                Find chargers that actually work.
              </h1>
              <p className="hero-premium__subtitle">
                The worst part of driving electric isn't range — it's arriving at a "charger" that's offline, occupied, or the wrong connector. Waypoint shows you live slot availability, connector type, and charging speed before you commit to the detour.
              </p>
              <div className="hero-premium__cta">
                <Link to="/route-planner" className="btn btn--primary btn--lg">Find EV charging near me</Link>
                <Link to="/route-planner" className="btn btn--outline btn--lg">Plan an EV road trip</Link>
              </div>
            </div>
            
            <div className="hero-premium__collage">
              <div className="hero-premium__image-main">
                <img src="./images/ev_plugging_1783055060578.png" alt="EV Charging" />
              </div>
              
              {/* Floating Widget 1 */}
              <div className="hero-premium__widget hero-premium__widget--top-right">
                <div className="widget-card">
                  <div className="widget-card__header">
                    <span className="widget-card__dot widget-card__dot--active"></span>
                    <span className="widget-card__title">Live Slot Availability</span>
                  </div>
                  <div className="widget-card__slots">
                    <div className="slot slot--free">3 Free</div>
                    <div className="slot slot--busy">1 Busy</div>
                  </div>
                  <div className="widget-card__meta">Confirmed 2 mins ago</div>
                </div>
              </div>

              {/* Floating Widget 2 */}
              <div className="hero-premium__widget hero-premium__widget--bottom-left">
                <div className="widget-card">
                  <div className="widget-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div className="widget-card__stats">
                    <div className="widget-card__val">120 kW</div>
                    <div className="widget-card__lbl">DC Fast Charger</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-bar__grid">
            <div className="stats-bar__item">
              <div className="stats-bar__value">12,000+</div>
              <div className="stats-bar__label">Public Chargers Mapped</div>
            </div>
            <div className="stats-bar__item">
              <div className="stats-bar__value">15+</div>
              <div className="stats-bar__label">Charging Networks</div>
            </div>
            <div className="stats-bar__item">
              <div className="stats-bar__value">240+</div>
              <div className="stats-bar__label">Cities With DC Fast</div>
            </div>
            <div className="stats-bar__item">
              <div className="stats-bar__value">Live</div>
              <div className="stats-bar__label">Slot Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Every Network Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section__header text-center">
            <h2 className="section__title">Every network, one app to find them.</h2>
            <p className="section__subtitle">
              Statiq, ChargeZone, Tata Power, Ather Grid, Zeon and more each run their own app and their own map. Waypoint pulls them together so you can find the nearest working charger regardless of who operates it.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card__icon feature-card__icon--teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <path d="M9 3v18M15 3v18"/>
                </svg>
              </div>
              <h3>Networks we cover</h3>
              <p>A live directory of the charging networks mapped in your region — which brands operate near you, how many points each runs, their typical speeds, and how you pay at them.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-card__icon feature-card__icon--teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Why one map beats six apps</h3>
              <p>Juggling a separate app per network means you only ever see part of the picture. Waypoint shows all of them at once, so "nearest working charger" actually means nearest.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-card__icon feature-card__icon--teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <h3>Membership-aware filtering</h3>
              <p>Hold memberships with certain networks? Filter to just those so every result is a charger you can pay at without downloading anything new.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Connectors & Speeds Layout */}
      <section className="section">
        <div className="container">
          <div className="split-layout">
            <div className="split-layout__content">
              <h2 className="section__title">Never pull up to the wrong plug again.</h2>
              <p className="section__subtitle">
                Type 2, CCS2, CHAdeMO, and Bharat AC/DC — India's EV charging still runs on a mix of connectors, and the wrong one means a wasted trip. Set yours once and Waypoint only shows chargers your car can use.
              </p>
              
              <ul className="info-list">
                <li>
                  <strong>Type 2 (AC)</strong>
                  <span>The standard AC connector on most modern EVs in India. Reliable, everywhere, but not fast.</span>
                </li>
                <li>
                  <strong>CCS2 (DC fast)</strong>
                  <span>The dominant DC fast-charging standard for new EVs. If you drive a recent EV, this is likely your road-trip connector.</span>
                </li>
                <li>
                  <strong>CHAdeMO (DC)</strong>
                  <span>An older DC fast-charging standard found on some earlier and imported EVs.</span>
                </li>
              </ul>
              <Link to="/ev" className="btn btn--outline mt-4">Set my connector type</Link>
            </div>
            
            <div className="split-layout__image split-layout__image--teal">
              <img src="./images/charger_handle_1783055070397.png" alt="EV Charger Connectors" />
            </div>
          </div>
        </div>
      </section>

      {/* Road Trip Section */}
      <section className="section bg-dark text-white">
        <div className="container text-center">
          <h2 className="section__title text-white">Long drives, zero range anxiety.</h2>
          <p className="section__subtitle text-white opacity-80 max-w-2xl mx-auto">
            EV road trips live and die on planning. Waypoint maps your entire route around your car's real range, places charging stops at the right intervals, and always keeps a confirmed-working fallback before any risky stretch — so you drive relaxed, not white-knuckled.
          </p>
          <div className="stats-strip mt-8">
            <div className="stat-item">
              <div className="stat-item__val">DC Fast</div>
              <div className="stat-item__lbl">Preferred Stops</div>
            </div>
            <div className="stat-item">
              <div className="stat-item__val">Live</div>
              <div className="stat-item__lbl">Slot Status</div>
            </div>
            <div className="stat-item">
              <div className="stat-item__val">Dynamic</div>
              <div className="stat-item__lbl">Rerouting</div>
            </div>
          </div>
          <Link to="/route-planner" className="btn btn--primary btn--lg mt-8">Plan my EV road trip</Link>
        </div>
      </section>
    </div>
  );
}
