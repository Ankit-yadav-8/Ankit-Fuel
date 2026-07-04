import React from 'react';
import { Link } from 'react-router-dom';

const team = [
  { name: 'Ankit Yadav', role: 'Founder & CEO', avatar: 'AY', bio: 'Full-stack developer passionate about building India\'s fuel tech ecosystem.' },
  { name: 'Sneha Gupta', role: 'Head of Product', avatar: 'SG', bio: 'Former Google Maps PM. Expert in geospatial products and user experience.' },
  { name: 'Rahul Verma', role: 'Lead Engineer', avatar: 'RV', bio: '10+ years in scalable systems. Previously at Flipkart and Ola.' },
  { name: 'Meera Iyer', role: 'Head of AI', avatar: 'MI', bio: 'IIT Bombay alumna. Specializes in recommendation systems and predictive analytics.' },
];

const timeline = [
  { year: '2025', title: 'Idea Born', desc: 'Identified the gap in unified fuel navigation for India.' },
  { year: '2026 Q1', title: 'Development Begins', desc: 'Built the core platform with AI recommendations and queue prediction.' },
  { year: '2026 Q2', title: 'Beta Launch', desc: '10,000 stations listed. 5,000 beta users across 8 cities.' },
  { year: '2026 Q3', title: 'Public Launch', desc: 'Full launch with EV, CNG, Petrol, and Diesel support across India.' },
  { year: '2027', title: 'Mobile App & Partnerships', desc: 'Flutter app launch. Partnerships with IOCL, BPCL, Tata Power.' },
];

const aboutStats = [
  { value: '12,000+', label: 'Stations Listed' },
  { value: '500+', label: 'Cities Covered' },
  { value: '50,000+', label: 'Active Users' },
  { value: '98%', label: 'Data Accuracy' },
];

const values = [
  { icon: '🎯', title: 'Accuracy First', desc: 'Every data point is verified. Community reports are cross-checked with AI for reliability.' },
  { icon: '🌱', title: 'Sustainability', desc: 'We promote cleaner fuel choices and help EV adoption by making charging accessible.' },
  { icon: '🤝', title: 'Community Driven', desc: 'Our data gets better with every user contribution. We reward the community that builds our platform.' },
  { icon: '🔒', title: 'Privacy by Design', desc: 'Location data is anonymized. We never sell personal data. Period.' },
];

export default function About() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__grid">
            <div className="page-hero__content">
              <span className="hero__badge">🏢 About Fuel-India</span>
              <h1 className="page-hero__title">Building India's Unified Fuel Navigation Platform</h1>
              <p className="page-hero__subtitle">
                We're on a mission to make every refueling stop in India faster, cheaper, and smarter — whether you drive electric, CNG, petrol, or diesel.
              </p>
            </div>
            <div className="page-hero__image">
              <img src="./images/route_planning.png" alt="About Fuel India" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-bar__grid">
            {aboutStats.map((s) => (
              <div key={s.label} className="stats-bar__item">
                <div className="stats-bar__value">{s.value}</div>
                <div className="stats-bar__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Our Mission</span>
            <h2 className="section__title">Why We Exist</h2>
          </div>
          <div className="mission-content">
            <div className="mission-card">
              <h3>The Problem</h3>
              <p>India has 80,000+ fuel stations and a growing EV charging network, but no unified platform to navigate them. Drivers waste time in unpredictable queues, overpay for fuel, and struggle to find CNG or EV chargers on highway routes.</p>
            </div>
            <div className="mission-card mission-card--accent">
              <h3>Our Solution</h3>
              <p>Fuel-India combines real-time data, community reports, and AI to create the ultimate fuel navigation platform. One app for every fuel type — with queue prediction, price comparison, and smart route planning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Values</span>
            <h2 className="section__title">What We Stand For</h2>
          </div>
          <div className="features-grid features-grid--2col">
            {values.map((v) => (
              <div key={v.title} className="feature-card">
                <span className="feature-card__icon">{v.icon}</span>
                <h4 className="feature-card__title">{v.title}</h4>
                <p className="feature-card__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Journey</span>
            <h2 className="section__title">Our Journey So Far</h2>
          </div>
          <div className="timeline">
            {timeline.map((t) => (
              <div key={t.year} className="timeline-item">
                <div className="timeline-item__dot" />
                <div className="timeline-item__content">
                  <span className="timeline-item__year">{t.year}</span>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Team</span>
            <h2 className="section__title">The People Behind Fuel-India</h2>
          </div>
          <div className="team-grid">
            {team.map((t) => (
              <div key={t.name} className="team-card">
                <div className="team-card__avatar">{t.avatar}</div>
                <div className="team-card__info">
                  <h3>{t.name}</h3>
                  <div className="team-card__role">{t.role}</div>
                  <p className="team-card__bio">{t.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-card__title">Want to Build This With Us?</h2>
            <p className="cta-card__desc">We're hiring engineers, data scientists, and city launchers across India.</p>
            <div className="cta-card__actions">
              <Link to="/contact" className="btn btn--white btn--lg">View Open Roles</Link>
              <Link to="/blog" className="btn btn--outline btn--ghost btn--lg">Read Our Blog</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
