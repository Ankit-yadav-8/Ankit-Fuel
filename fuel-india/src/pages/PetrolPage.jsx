import React from 'react';
import { Link } from 'react-router-dom';

export default function PetrolPage() {
  return (
    <div className="page">
      {/* Premium Hero Section */}
      <section className="hero-premium">
        <div className="container">
          <div className="hero-premium__grid">
            <div className="hero-premium__content">
              <div className="hero__badge">Petrol & Diesel Network</div>
              <h1 className="hero-premium__title">
                The nearest open pump, not just the nearest pump.
              </h1>
              <p className="hero-premium__subtitle">
                Waypoint finds petrol and diesel stations around you and filters for the ones that are actually open and stocked — with today's prices and any queue, so you fill up fast and fair.
              </p>
              <div className="hero-premium__cta">
                <Link to="/petrol" className="btn btn--primary btn--lg">Find petrol & diesel near me</Link>
                <Link to="/route-planner" className="btn btn--outline btn--lg">Plan highway fuel stops</Link>
              </div>
            </div>
            
            <div className="hero-premium__collage">
              <div className="hero-premium__image-main">
                <img src="./images/cng_pump_1783050817670.png" alt="Petrol Pump" />
              </div>
              
              {/* Floating Widget 1 */}
              <div className="hero-premium__widget hero-premium__widget--top-right">
                <div className="widget-card">
                  <div className="widget-card__header">
                    <span className="widget-card__dot widget-card__dot--active"></span>
                    <span className="widget-card__title">Today's Price</span>
                  </div>
                  <div className="widget-card__stats">
                    <div className="widget-card__val">₹102.50</div>
                    <div className="widget-card__lbl">Petrol • IOCL</div>
                  </div>
                  <div className="widget-card__meta">Confirmed 5 mins ago</div>
                </div>
              </div>

              {/* Floating Widget 2 */}
              <div className="hero-premium__widget hero-premium__widget--bottom-left">
                <div className="widget-card">
                  <div className="widget-card__header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    <span className="widget-card__title ml-2">Available</span>
                  </div>
                  <div className="widget-card__stats">
                    <div className="widget-card__val" style={{fontSize: '14px', marginTop: '4px'}}>Diesel in stock</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter by Brand */}
      <section className="section bg-light">
        <div className="container">
          <div className="split-layout">
            <div className="split-layout__image split-layout__image--amber">
              <img src="./images/diesel_fleet_1783050838517.png" alt="Filter by Brand" />
            </div>
            <div className="split-layout__content">
              <h2 className="section__title">Your brand, your loyalty points, your call.</h2>
              <p className="section__subtitle">
                Filter the map to IOCL, BPCL, HPCL, Reliance, Nayara, Shell, or independents — so every pump you see fits your loyalty program, fuel card, and quality preference.
              </p>
              
              <ul className="info-list">
                <li>
                  <strong>Loyalty rewards</strong>
                  <span>Keep earning on the program you're already in.</span>
                </li>
                <li>
                  <strong>Fuel cards</strong>
                  <span>Corporate and fleet cards aren't accepted everywhere; filter to where yours works.</span>
                </li>
                <li>
                  <strong>Fuel quality</strong>
                  <span>Premium grades and brand-specific formulations differ; stick with what your engine likes.</span>
                </li>
              </ul>
              <Link to="/petrol" className="btn btn--outline mt-4">Choose your fuel brands</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section">
        <div className="container">
          <div className="section__header text-center">
            <h2 className="section__title">More than just locations.</h2>
            <p className="section__subtitle">Live pricing, real stock availability, and highway routing.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card__icon feature-card__icon--amber">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
              <h3>Today's Price Comparison</h3>
              <p>Fuel prices move, and they vary pump to pump. Waypoint shows today's petrol and diesel prices across nearby stations side by side — so a full tank costs you less without a single extra stop.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-card__icon feature-card__icon--amber">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3>Stock / Availability Reports</h3>
              <p>A pump can be open and still out of your fuel. Waypoint surfaces live stock reports from drivers so you skip the empty ones. When a driver finds a pump out of diesel or petrol, one tap flags it.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-card__icon feature-card__icon--amber">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </div>
              <h3>Highway Pumps</h3>
              <p>On the highway, the gaps between pumps are wide. Waypoint maps highway fuel stations along your route with live prices, stock, and amenities — so long drives and freight runs never come down to luck.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
