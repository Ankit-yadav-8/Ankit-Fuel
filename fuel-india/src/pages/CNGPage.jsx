import React from 'react';
import { Link } from 'react-router-dom';

export default function CNGPage() {
  return (
    <div className="page">
      {/* Premium Hero Section */}
      <section className="hero-premium">
        <div className="container">
          <div className="hero-premium__grid">
            <div className="hero-premium__content">
              <div className="hero__badge">CNG Network</div>
              <h1 className="hero-premium__title">
                The hardest fuel to find, finally easy.
              </h1>
              <p className="hero-premium__subtitle">
                CNG stations are sparse and often crowded — and running out mid-city with no station in sight is genuinely stressful. Waypoint shows the nearest working CNG stations, live queue times, and a running-low quick-find for the moments that count.
              </p>
              <div className="hero-premium__cta">
                <Link to="/cng" className="btn btn--primary btn--lg">Find CNG near me</Link>
                <Link to="/cng" className="btn btn--outline btn--lg">I'm running low</Link>
              </div>
            </div>
            
            <div className="hero-premium__collage">
              <div className="hero-premium__image-main">
                <img src="./images/cng_pump_1783050817670.png" alt="CNG Pump" style={{ filter: 'hue-rotate(-40deg)' }} />
              </div>
              
              {/* Floating Widget 1 */}
              <div className="hero-premium__widget hero-premium__widget--top-right">
                <div className="widget-card">
                  <div className="widget-card__header">
                    <span className="widget-card__dot widget-card__dot--active"></span>
                    <span className="widget-card__title">Live Queue Time</span>
                  </div>
                  <div className="widget-card__stats">
                    <div className="widget-card__val" style={{ color: '#F59E0B' }}>15 mins</div>
                    <div className="widget-card__lbl">IGL Station • Sec 14</div>
                  </div>
                  <div className="widget-card__meta">Updated by Ankit 1 min ago</div>
                </div>
              </div>

              {/* Floating Widget 2 */}
              <div className="hero-premium__widget hero-premium__widget--bottom-left">
                <div className="widget-card">
                  <div className="widget-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div className="widget-card__stats">
                    <div className="widget-card__val" style={{fontSize: '14px', marginTop: '4px'}}>Running Low Mode</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Queue Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="split-layout">
            <div className="split-layout__content">
              <h2 className="section__title">Never sit in a CNG queue blind again.</h2>
              <p className="section__subtitle">
                The CNG queue is the real cost — sometimes longer than the drive. Waypoint shows live, driver-reported wait times at CNG stations, so you pick the shortest line, not just the nearest one.
              </p>
              
              <ul className="info-list">
                <li>
                  <strong>Wait times from the queue itself</strong>
                  <span>Drivers in line report how long it's taking. When the queue clears, the next report updates it.</span>
                </li>
                <li>
                  <strong>Rush-hour intelligence</strong>
                  <span>Waypoint learns each station's busy hours and warns you before you drive into a peak.</span>
                </li>
                <li>
                  <strong>Weigh distance against the line</strong>
                  <span>A 5-minute drive to a 40-minute queue versus a 12-minute drive to no line at all.</span>
                </li>
              </ul>
              <Link to="/cng" className="btn btn--outline mt-4">Check CNG queues</Link>
            </div>
            
            <div className="split-layout__image split-layout__image--cyan">
              <img src="./images/map_graphic_1783055080446.png" alt="CNG Queues Map" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section">
        <div className="container">
          <div className="section__header text-center">
            <h2 className="section__title">Built for the CNG Commute</h2>
            <p className="section__subtitle">Routing and emergency features designed specifically for CNG's unique challenges.</p>
          </div>
          
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="feature-card">
              <div className="feature-card__icon feature-card__icon--cyan">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3>CNG on My Route</h3>
              <p>With short range and sparse stations, CNG punishes bad planning hardest. Enter your route and Waypoint maps every CNG station along it — with queues and availability — so you always know where your next confirmed refill is.</p>
              <Link to="/route-planner" className="link-arrow mt-4">Plan CNG on my route →</Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-card__icon feature-card__icon--cyan">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3>Nearest CNG if Running Low</h3>
              <p>When your CNG is nearly gone, one tap surfaces the closest confirmed working station with a reachable queue — filtering out anything unverified, closed, or too far — so a stressful moment becomes a short, sure drive.</p>
              <Link to="/cng" className="link-arrow mt-4">I'm running low →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
