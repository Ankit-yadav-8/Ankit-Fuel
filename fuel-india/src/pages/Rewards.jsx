import React from 'react';
import { Link } from 'react-router-dom';

const rewardActions = [
  { action: 'Queue Report', points: '+10', icon: '📊', desc: 'Report queue length at any station' },
  { action: 'Write Review', points: '+15', icon: '⭐', desc: 'Rate and review a station' },
  { action: 'Upload Photo', points: '+5', icon: '📸', desc: 'Add a photo to any station' },
  { action: 'Referral', points: '+50', icon: '🤝', desc: 'Invite a friend who signs up' },
  { action: 'Sign Up', points: '+50', icon: '🎉', desc: 'One-time welcome bonus' },
];

const tiers = [
  { name: 'Starter', range: '0 – 99 pts', perks: 'Basic access, queue reports', color: '#94A3B8' },
  { name: 'Bronze', range: '100 – 499 pts', perks: 'Priority support, price alerts', color: '#CD7F32' },
  { name: 'Silver', range: '500 – 999 pts', perks: 'Fuel vouchers, early features', color: '#C0C0C0' },
  { name: 'Gold', range: '1000+ pts', perks: 'Premium API, partner offers, VIP', color: '#FFD700' },
];

const redeemOptions = [
  { title: 'Fuel Voucher ₹50', points: '200 pts', icon: '⛽' },
  { title: 'EV Charging Credit ₹100', points: '400 pts', icon: '⚡' },
  { title: 'Amazon Gift Card ₹100', points: '500 pts', icon: '🛒' },
  { title: 'Partner Restaurant Coupon', points: '150 pts', icon: '🍔' },
];

export default function Rewards() {
  return (
    <div className="page">
      <section className="page-hero page-hero--compact">
        <div className="container">
          <div className="section__header" style={{ textAlign: 'center' }}>
            <span className="hero__badge">🎁 Rewards Program</span>
            <h1 className="page-hero__title" style={{ maxWidth: 600, margin: '0 auto' }}>
              Earn Points, Save Money on Every Refuel
            </h1>
            <p className="page-hero__subtitle" style={{ maxWidth: 500, margin: '0.5rem auto 0' }}>
              Contribute to the community by reporting queues and reviews. Earn points redeemable for fuel vouchers and more.
            </p>
          </div>
        </div>
      </section>

      {/* Earn Points */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Earn</span>
            <h2 className="section__title">How to Earn Points</h2>
          </div>
          <div className="rewards-earn-grid">
            {rewardActions.map((r) => (
              <div key={r.action} className="reward-earn-card">
                <span className="reward-earn-card__icon">{r.icon}</span>
                <div>
                  <h4 className="reward-earn-card__action">{r.action}</h4>
                  <p className="reward-earn-card__desc">{r.desc}</p>
                </div>
                <span className="reward-earn-card__points">{r.points}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Tiers</span>
            <h2 className="section__title">Climb the Reward Tiers</h2>
          </div>
          <div className="tiers-grid">
            {tiers.map((t) => (
              <div key={t.name} className="tier-card" style={{ '--tier-color': t.color }}>
                <div className="tier-card__badge" style={{ background: t.color }}>{t.name}</div>
                <div className="tier-card__range">{t.range}</div>
                <p className="tier-card__perks">{t.perks}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redeem */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Redeem</span>
            <h2 className="section__title">What Can You Redeem?</h2>
          </div>
          <div className="redeem-grid">
            {redeemOptions.map((r) => (
              <div key={r.title} className="redeem-card">
                <span className="redeem-card__icon">{r.icon}</span>
                <h4 className="redeem-card__title">{r.title}</h4>
                <span className="redeem-card__points">{r.points}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-card__title">Start Earning Today</h2>
            <p className="cta-card__desc">Sign up and get 50 bonus points instantly. Your first queue report earns another 10!</p>
            <div className="cta-card__actions">
              <Link to="/route-planner" className="btn btn--primary btn--lg">Join Now — It's Free</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
