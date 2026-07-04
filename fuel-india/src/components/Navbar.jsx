import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'EV', path: '/ev' },
  { label: 'Petrol & Diesel', path: '/petrol' },
  { label: 'CNG', path: '/cng' },
  { label: 'Rewards', path: '/rewards' },
  { label: 'About', path: '/about' },
];

const mobileExtraLinks = [
  { label: 'Fleet & Diesel', path: '/diesel' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
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
            <Link to="/route-planner" className="btn btn--outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 20l-5.447-2.724A2 2 0 013 15.487V5.736A2 2 0 014.106 4.11l4.447-2.224a2 2 0 011.794 0L15 4.5l4.447-2.224A2 2 0 0122 4.062v10.453a2 2 0 01-1.106 1.789L15 19.5l-4.66-2.33a2 2 0 00-1.788 0l-5.447 2.724" /><path d="M9 2v17" /><path d="M15 5v15" /></svg>
              Plan Route
            </Link>
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
            {[...navLinks, ...mobileExtraLinks].map((link) => (
              <div key={link.label} className="mobile-menu__group">
                <Link to={link.path} className="mobile-menu__title">{link.label}</Link>
              </div>
            ))}
            <div className="mobile-menu__cta" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
              <Link to="/route-planner" className="btn btn--outline" style={{ width: '100%' }}>Plan Route</Link>
              <Link to="/demo" className="btn btn--primary" style={{ width: '100%' }}>Book a Demo</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
