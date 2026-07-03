import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { value: 12000, suffix: '+', label: 'Stations Listed' },
  { value: 500, suffix: '+', label: 'Cities Covered' },
  { value: 50000, suffix: '+', label: 'Active Users' },
  { value: 98, suffix: '%', label: 'Accuracy Rate' },
];

const solutions = [
  { icon: '⚡', title: 'EV Owners', desc: 'Find fast chargers and plan your EV journey across India.', path: '/ev' },
  { icon: '🚗', title: 'Daily Commuters', desc: 'Skip queues and save on fuel costs every day.', path: '/petrol' },
  { icon: '🚚', title: 'Fleet Operators', desc: 'Optimize fleet refueling across delivery routes.', path: '/diesel/fleet' },
  { icon: '🏠', title: 'RWAs & Complexes', desc: 'Install EV chargers in your residential society.', path: '/ev/home' },
  { icon: '🔧', title: 'Station Owners', desc: 'List your station and reach thousands of drivers.', path: '/contact' },
  { icon: '🏭', title: 'Fuel Companies', desc: 'Analytics and demand insights for your network.', path: '/contact' },
  { icon: '🚌', title: 'Public Transit', desc: 'CNG & EV solutions for city bus fleets.', path: '/cng' },
];

const testimonials = [
  {
    quote: "Fuel-India helped our fleet reduce refueling downtime by 40%. The queue prediction is incredibly accurate and saves us hours every week.",
    name: "Rajesh Kumar",
    role: "Fleet Manager, Delhivery Logistics",
    avatar: "RK",
    image: "./images/cng_pump_1783050817670.png"
  },
  {
    quote: "Finally one app for all fuel types! I can plan my CNG stops on long drives without worrying about queues or price surprises.",
    name: "Priya Sharma",
    role: "Freelance Driver, Uber",
    avatar: "PS",
    image: "./images/petrol_station_1783050827829.png"
  },
  {
    quote: "The AI recommendations saved me ₹2,000 last month just by suggesting better-priced stations on my daily commute.",
    name: "Amit Patel",
    role: "Small Business Owner, Ahmedabad",
    avatar: "AP",
    image: "./images/ev_charging_1783050805744.png"
  },
];

const blogPosts = [
  {
    date: 'June 28, 2026',
    tag: 'EV',
    title: "India's EV Charging Infrastructure: Where We Stand in 2026",
    image: './images/ev_charging_1783050805744.png',
  },
  {
    date: 'June 22, 2026',
    tag: 'CNG',
    title: 'CNG Price Trends: Why Prices Dropped 12% This Quarter',
    image: './images/cng_pump_1783050817670.png',
  },
  {
    date: 'June 15, 2026',
    tag: 'Technology',
    title: 'How AI Queue Prediction Works Behind The Scenes',
    image: './images/queue_prediction.png',
  },
];

function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.5 });

    const el = document.getElementById(`counter-${target}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target, started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, started]);

  return <span id={`counter-${target}`}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page">
      {/* ─── Hero Section (ionage-style centered) ─── */}
      <section className="hero">
        {/* Animated background blobs */}
        <div className="hero__bg">
          <div className="hero__blob hero__blob--1"></div>
          <div className="hero__blob hero__blob--2"></div>
          <div className="hero__blob hero__blob--3"></div>
        </div>

        <div className="container">
          <div className="hero__center">
            <h1 className="hero__title">
              The Core of Your{' '}
              <span className="hero__title-icons">
                <span className="hero__inline-icon hero__inline-icon--fuel">⛽</span>
                <span className="hero__inline-icon hero__inline-icon--ev">⚡</span>
              </span>{' '}
              Fuel Navigation Tech
            </h1>
            <p className="hero__subtitle">
              Fuel-India, a unified, purpose-built platform, connects drivers, fleets{' '}
              and fuel stations with smart AI-driven navigation solutions.
            </p>
            <Link to="/route-planner" className="hero__cta-btn">
              Get Started with Fuel-India
            </Link>
          </div>

          {/* Hero Collage Section */}
          <div className="hero__collage">
            {/* Column 1 (Left) */}
            <div className="hero__collage-col hero__collage-col--1">
              <div className="hero__card hero__card--tall">
                <img src="./images/cng_pump_1783050817670.png" alt="CNG Stations" />
                <div className="hero__card-overlay">CNG & Gas Stations</div>
                
                {/* Floating stats on the left card */}
                <div className="hero__card-floating-stat" style={{ top: '20px', right: 'auto', left: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#666', paddingBottom: '4px' }}>CPO Revenue</div>
                  <strong style={{ color: '#22c55e', fontSize: '18px' }}>₹4,63,987</strong>
                </div>
                <div className="hero__card-floating-stat" style={{ top: '100px', right: 'auto', left: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#666' }}>In Use</div>
                  <div style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '800' }}>⚡ 120</div>
                </div>
                <div className="hero__card-floating-stat" style={{ top: '160px', right: 'auto', left: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#666' }}>Active</div>
                  <div style={{ color: '#14b8a6', fontSize: '16px', fontWeight: '800' }}>⛽ 145</div>
                </div>
              </div>

              <div className="hero__widget hero__widget--green">
                <div className="hero__widget-badge">My Green Path</div>
                <div className="hero__widget-energy">
                  <div><span>⚡</span><strong>166 kWh</strong><small>Energy used</small></div>
                  <div><span>🌱</span><strong>1Kg CO2</strong><small>Saved</small></div>
                </div>
              </div>
            </div>

            {/* Column 2 (Center) */}
            <div className="hero__collage-col hero__collage-col--2">
              <div className="hero__card hero__card--wide" style={{ background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="./images/marketplace_nodes.png" alt="Marketplace Nodes" style={{ width: '100%', height: '70%', objectFit: 'contain', padding: '20px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '800', textAlign: 'center', lineHeight: '1.3', padding: '0 20px 20px 20px' }}>Marketplace for connecting CPOs and Fleets</h3>
              </div>
              
              <div className="hero__card hero__card--square">
                <div className="hero__widget hero__widget--route" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%' }}>
                  <div className="hero__widget-dots">
                    <span className="dot dot--start"></span><span className="line"></span>
                    <span className="dot dot--mid"></span><span className="line"></span>
                    <span className="dot dot--end"></span>
                  </div>
                  <div className="hero__widget-route-text">✓ Journey Possible</div>
                </div>
              </div>
            </div>

            {/* Column 3 (Right) */}
            <div className="hero__collage-col hero__collage-col--3">
              <div className="hero__card hero__card--wide">
                <img src="./images/ev_charging_1783050805744.png" alt="EV Charging" />
                <div className="hero__card-overlay">Home & Public Charging</div>
              </div>
              
              <div className="hero__card hero__card--square">
                <img src="./images/diesel_fleet_1783050838517.png" alt="Fleet Drivers" />
                <div className="hero__card-overlay">Fleet Driver Details</div>
                
                {/* Floating Widget over image */}
                <div className="hero__widget hero__widget--mini" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', flexDirection: 'column', alignItems: 'flex-start', padding: '24px' }}>
                   <div style={{ color: '#3b82f6', fontSize: '11px', border: '1px solid #3b82f6', borderRadius: '12px', padding: '2px 8px', marginBottom: '12px' }}>Fleet Driver Details</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div className="hero__widget-avatar" style={{width: '32px', height: '32px'}}>MR</div>
                      <div>
                        <strong style={{ fontSize: '13px' }}>Muthuswamy R</strong>
                        <span style={{ fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%'}}></span> Charging</span>
                      </div>
                      <div style={{ marginLeft: 'auto', fontWeight: '800', fontSize: '16px' }}>76%</div>
                   </div>
                   <div style={{ width: '100%', height: '4px', background: '#e5e7eb', borderRadius: '2px', marginBottom: '16px' }}>
                     <div style={{ width: '76%', height: '100%', background: '#22c55e', borderRadius: '2px' }}></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ─── Product Sections (ionage card style) ─── */}
      <section className="section">
        <div className="container">
          {/* Section 1: Station Finder */}
          <div className="product-card">
            <div className="product-card__visual">
              <img src="./images/petrol_station_1783050827829.png" alt="Station Finder" className="product-card__img product-card__img--main" />
              <img src="./images/cng_pump_1783050817670.png" alt="CNG" className="product-card__img product-card__img--float" />
            </div>
            <div className="product-card__content">
              <span className="product-card__tag">STATION FINDER</span>
              <h3 className="product-card__title">Seamless Station Discovery, Smarter Fuel Management</h3>
              <p className="product-card__desc">
                A smart, connected solution for effortless fuel station discovery across petrol, diesel, CNG, and EV. Compare prices, check amenities, and manage your refueling with ease.
              </p>
              <Link to="/petrol" className="product-card__link">
                Learn More <span className="product-card__arrow">↗</span>
              </Link>
            </div>
          </div>

          {/* Section 2: Route Planner */}
          <div className="product-card product-card--reverse">
            <div className="product-card__visual">
              <img src="./images/route_planning.png" alt="Route Planner" className="product-card__img product-card__img--main" />
            </div>
            <div className="product-card__content">
              <span className="product-card__tag">FUEL-INDIA APP</span>
              <h3 className="product-card__title">Smart and Convenient Fueling At Home, on the Go, and Beyond</h3>
              <p className="product-card__desc">
                The ultimate fuel navigation companion. Find stations, plan routes, predict queues, and get AI recommendations — all in one app.
              </p>
              <div className="product-card__buttons">
                <Link to="/route-planner" className="product-card__btn product-card__btn--dark">Download App</Link>
                <Link to="/about" className="product-card__link">
                  Learn More <span className="product-card__arrow">↗</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Section 3: Developer Tools / API */}
          <div className="product-card">
            <div className="product-card__visual">
              <img src="./images/queue_prediction.png" alt="Queue Predictor" className="product-card__img product-card__img--main" />
            </div>
            <div className="product-card__content">
              <span className="product-card__tag">DEVELOPER TOOLS</span>
              <h3 className="product-card__title">Powering Smarter Fuel Experiences</h3>

              <div className="product-card__sub">
                <h4>Discovery API</h4>
                <p>Integrates real-time station data into vehicle systems and maps, boosting accessibility and confidence.</p>
                <Link to="/contact" className="product-card__link">
                  Learn More <span className="product-card__arrow">↗</span>
                </Link>
              </div>

              <div className="product-card__sub">
                <h4>SDK For Business (Closed Beta)</h4>
                <p>Enables businesses to add fuel station discovery to their apps, enhancing engagement and brand value.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Complete Solutions Grid ─── */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Complete Solutions</span>
            <h2 className="section__title">Complete Solutions for the Entire Fuel Ecosystem</h2>
            <p className="section__subtitle">Whether you're a daily commuter, fleet operator, or station owner — we provide the tools to save time and money.</p>
          </div>
          <div className="solutions-grid">
            {solutions.map((sol) => (
              <Link key={sol.title} to={sol.path} className="solution-card">
                <span className="solution-card__icon">{sol.icon}</span>
                <h4 className="solution-card__title">{sol.title}</h4>
                <p className="solution-card__desc">{sol.desc}</p>
                <span className="solution-card__arrow">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials (ionage-style with image) ─── */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Customer Stories</span>
            <h2 className="section__title">What Our Users Say</h2>
          </div>
          <div className="testimonial-ionage">
            <div className="testimonial-ionage__text">
              <blockquote className="testimonial-ionage__quote">
                "{testimonials[activeTestimonial].quote}"
              </blockquote>
              <div className="testimonial-ionage__author">
                <strong>{testimonials[activeTestimonial].name}</strong>
                <span>{testimonials[activeTestimonial].role}</span>
              </div>
            </div>
            <div className="testimonial-ionage__image">
              <img src={testimonials[activeTestimonial].image} alt={testimonials[activeTestimonial].name} />
            </div>
          </div>
          <div className="testimonial-ionage__nav">
            <button className="testimonial-ionage__arrow" onClick={() => setActiveTestimonial((activeTestimonial - 1 + testimonials.length) % testimonials.length)}>←</button>
            <div className="testimonial-ionage__dots">
              {testimonials.map((_, i) => (
                <button key={i} className={`testimonial-ionage__dot ${i === activeTestimonial ? 'testimonial-ionage__dot--active' : ''}`} onClick={() => setActiveTestimonial(i)} />
              ))}
            </div>
            <button className="testimonial-ionage__arrow" onClick={() => setActiveTestimonial((activeTestimonial + 1) % testimonials.length)}>→</button>
          </div>
        </div>
      </section>

      {/* ─── Blog Preview ─── */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header section__header--row">
            <div>
              <span className="section__tag">Insights</span>
              <h2 className="section__title">Start Here to Deconfuse the Evolving Fuel Landscape</h2>
            </div>
            <Link to="/blog" className="btn btn--outline btn--sm">View All ↗</Link>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <Link key={post.title} to="/blog" className="blog-card">
                <div className="blog-card__image">
                  <img src={post.image} alt={post.title} />
                  <span className="blog-card__tag">{post.tag}</span>
                </div>
                <div className="blog-card__body">
                  <span className="blog-card__date">{post.date}</span>
                  <h4 className="blog-card__title">{post.title} ↗</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-card__title">Ready to Navigate Smarter?</h2>
            <p className="cta-card__desc">Join 50,000+ users who save time and money on every refueling stop.</p>
            <div className="cta-card__actions">
              <Link to="/route-planner" className="btn btn--primary btn--lg">Get Started Free</Link>
              <Link to="/contact" className="btn btn--white btn--lg">Talk to Sales</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
