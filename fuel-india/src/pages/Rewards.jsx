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

const programStats = [
  { label: 'Community Members', value: '38,400', unit: 'users' },
  { label: 'Points Awarded', value: '2.1M', unit: 'points' },
  { label: 'Vouchers Redeemed', value: '11,250', unit: 'vouchers' },
];

const leaderboard = [
  { rank: 1, name: 'Vikram S. — Delhi', points: '4,820 pts' },
  { rank: 2, name: 'Anita R. — Bangalore', points: '4,215 pts' },
  { rank: 3, name: 'Mohammed F. — Mumbai', points: '3,980 pts' },
  { rank: 4, name: 'Deepak K. — Pune', points: '3,410 pts' },
  { rank: 5, name: 'Shruti M. — Hyderabad', points: '3,150 pts' },
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
          <div className="rewards-stats">
            {programStats.map((s) => (
              <div key={s.label} className="stat-card">
                <h3>{s.label}</h3>
                <div className="stat-card__value">{s.value} <span>{s.unit}</span></div>
              </div>
            ))}
          </div>
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

      {/* Leaderboard */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Leaderboard</span>
            <h2 className="section__title">This Month's Top Contributors</h2>
            <p className="section__subtitle">The drivers keeping India's fuel data fresh — one queue report at a time.</p>
          </div>
          <div className="leaderboard">
            {leaderboard.map((u) => (
              <div key={u.rank} className="leaderboard-item">
                <span className="leaderboard-item__rank">#{u.rank}</span>
                <span className="leaderboard-item__name">{u.name}</span>
                <span className="leaderboard-item__points">{u.points}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-card__title">Start Earning From Your Next Refuel</h2>
            <p className="cta-card__desc">Sign up today and grab your 50-point welcome bonus instantly.</p>
            <div className="cta-card__actions">
              <Link to="/route-planner" className="btn btn--white btn--lg">Get Started Free</Link>
              <Link to="/contact" className="btn btn--outline btn--ghost btn--lg">Partner With Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
