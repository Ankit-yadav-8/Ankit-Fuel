import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Find Stations', path: '/petrol' },
  { label: 'Route Planner', path: '/route-planner' },
  { label: 'Station Detail', path: '/station/1' },
  { label: 'EV Charging', path: '/ev' },
  { label: 'Petrol & Diesel', path: '/petrol' },
  { label: 'CNG', path: '/cng' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__container">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <img src="./images/logo.png" alt="Fuel-India" className="navbar__logo-img" />
            <span className="navbar__logo-text">Fuel-India</span>
          </Link>

          {/* Desktop Nav */}
          <div className="navbar__links">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <div key={link.label} className="navbar__item">
                  <Link to={link.path} className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
                    {link.label}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* User Dashboard / Login Area */}
          <div className="navbar__actions">
            <div className="navbar__user-menu">
              <Link to="/dashboard" className="navbar__user-link">Dashboard</Link>
              <div className="navbar__user-profile">
                <div className="navbar__user-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="navbar__user-details">
                  <span className="navbar__user-name">Ankit Yadav</span>
                  <span className="navbar__user-role">Premium Member</span>
                </div>
              </div>
            </div>
            
            <button className="navbar__burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu__overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-menu__panel">
            {navLinks.map((link) => (
              <div key={link.label} className="mobile-menu__group">
                <Link to={link.path} className="mobile-menu__title">{link.label}</Link>
              </div>
            ))}
            <div className="mobile-menu__cta">
              <Link to="/dashboard" className="navbar__cta" style={{ width: '100%', textAlign: 'center' }}>Go to Dashboard</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
