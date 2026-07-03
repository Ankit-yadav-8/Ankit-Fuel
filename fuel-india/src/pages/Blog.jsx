import React from 'react';
import { Link } from 'react-router-dom';

const posts = [
  {
    id: 1,
    date: 'June 28, 2026',
    tag: 'EV',
    title: "India's EV Charging Infrastructure: Where We Stand in 2026",
    excerpt: 'With over 12,000 public chargers now installed, India has made significant strides. But is it enough to support the 2 million EVs expected by 2027?',
    image: './images/ev_charging_1783050805744.png',
    readTime: '6 min read',
  },
  {
    id: 2,
    date: 'June 22, 2026',
    tag: 'CNG',
    title: 'CNG Price Trends: Why Prices Dropped 12% This Quarter',
    excerpt: 'Increased domestic gas production and policy changes have driven CNG prices to their lowest point in 18 months. Here\'s what it means for consumers.',
    image: './images/cng_pump_1783050817670.png',
    readTime: '4 min read',
  },
  {
    id: 3,
    date: 'June 15, 2026',
    tag: 'Technology',
    title: 'How AI Queue Prediction Works Behind The Scenes',
    excerpt: 'A deep dive into the weighted scoring algorithm and temporal pattern analysis that powers our queue predictions.',
    image: './images/queue_prediction.png',
    readTime: '8 min read',
  },
  {
    id: 4,
    date: 'June 10, 2026',
    tag: 'Petrol',
    title: 'Petrol Prices in India: A City-by-City Breakdown for July 2026',
    excerpt: 'We analyzed petrol prices across 50 major cities. Here are the cheapest and most expensive places to refuel this month.',
    image: './images/petrol_station_1783050827829.png',
    readTime: '5 min read',
  },
  {
    id: 5,
    date: 'June 5, 2026',
    tag: 'Fleet',
    title: 'How Logistics Companies Are Saving 35% on Diesel Costs',
    excerpt: 'Three case studies of fleet operators who optimized their refueling routes using AI-powered route planning.',
    image: './images/diesel_fleet_1783050838517.png',
    readTime: '7 min read',
  },
  {
    id: 6,
    date: 'May 28, 2026',
    tag: 'Product',
    title: 'Introducing Fuel-India Rewards: Earn Points, Save Money',
    excerpt: 'Report queues, write reviews, upload photos — earn points redeemable for fuel vouchers and partner offers.',
    image: './images/route_planning.png',
    readTime: '3 min read',
  },
];

const tags = ['All', 'EV', 'CNG', 'Petrol', 'Fleet', 'Technology', 'Product'];

export default function Blog() {
  const [activeTag, setActiveTag] = React.useState('All');
  const filtered = activeTag === 'All' ? posts : posts.filter(p => p.tag === activeTag);

  return (
    <div className="page">
      <section className="page-hero page-hero--compact">
        <div className="container">
          <div className="section__header" style={{ textAlign: 'center' }}>
            <span className="hero__badge">📝 Fuel-India Blog</span>
            <h1 className="page-hero__title" style={{ maxWidth: 600, margin: '0 auto' }}>
              Start Here to Deconfuse the Evolving Fuel Landscape
            </h1>
            <p className="page-hero__subtitle" style={{ maxWidth: 500, margin: '0.5rem auto 0' }}>
              Industry insights, price trends, product updates, and fuel technology deep-dives.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Tag filters */}
          <div className="blog-tags">
            {tags.map(tag => (
              <button
                key={tag}
                className={`blog-tags__btn ${activeTag === tag ? 'blog-tags__btn--active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Featured post */}
          {filtered.length > 0 && (
            <div className="blog-featured">
              <div className="blog-featured__image">
                <img src={filtered[0].image} alt={filtered[0].title} />
                <span className="blog-card__tag">{filtered[0].tag}</span>
              </div>
              <div className="blog-featured__content">
                <div className="blog-featured__meta">
                  <span>{filtered[0].date}</span>
                  <span>{filtered[0].readTime}</span>
                </div>
                <h2 className="blog-featured__title">{filtered[0].title}</h2>
                <p className="blog-featured__excerpt">{filtered[0].excerpt}</p>
                <Link to="/blog" className="btn btn--outline btn--sm">Read Article ↗</Link>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="blog-grid">
            {filtered.slice(1).map((post) => (
              <Link key={post.id} to="/blog" className="blog-card">
                <div className="blog-card__image">
                  <img src={post.image} alt={post.title} />
                  <span className="blog-card__tag">{post.tag}</span>
                </div>
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <span className="blog-card__date">{post.date}</span>
                    <span className="blog-card__read">{post.readTime}</span>
                  </div>
                  <h4 className="blog-card__title">{post.title} ↗</h4>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-card__title">Subscribe to Our Newsletter</h2>
            <p className="cta-card__desc">Weekly fuel price updates, industry insights, and product announcements. No spam.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="newsletter-form__input" />
              <button className="btn btn--primary">Subscribe ↗</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
