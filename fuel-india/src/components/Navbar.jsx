import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Find Stations', path: '/petrol' },
  { label: 'Plan Route', path: '/route-planner' },
  { label: 'EV', path: '/ev' },
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
            <span className="navbar__logo-text" style={{ color: '#111827' }}>Fuel-India</span>
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

          {/* Action Area */}
          <div className="navbar__actions">
            <Link to="/demo" className="btn btn--primary">Book a Demo</Link>
            
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
              <Link to="/demo" className="btn btn--primary" style={{ width: '100%' }}>Book a Demo</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
