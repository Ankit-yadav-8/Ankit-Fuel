import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  {
    label: 'Products',
    path: '/products',
    megaMenu: {
      columns: [
        {
          heading: 'FUEL NAVIGATION',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              ),
              title: 'Station Finder',
              desc: 'Find petrol, diesel, CNG & EV stations near you with real-time data.',
              path: '/petrol',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              ),
              title: 'Route Planner',
              desc: 'AI-powered route planning with optimized fuel stops on your journey.',
              path: '/route-planner',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'Queue Predictor',
              desc: 'AI predicts wait times so you always pick the fastest station.',
              path: '/queue-predictor',
            },
          ],
        },
        {
          heading: 'FUEL TYPES',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'EV Charging',
              desc: 'Discover CCS, CHAdeMO & Type 2 chargers across India.',
              path: '/ev',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              ),
              title: 'CNG Stations',
              desc: 'Live queue reports and price tracking for CNG pumps.',
              path: '/cng',
            },
          ],
        },
      ],
      promo: {
        image: '/images/ev_charging_1783050805744.png',
        tag: 'New Feature',
        title: "AI-Powered Fuel Route Planning for India",
        desc: 'Plan your next road trip with smart fuel stops, queue predictions, and price comparisons.',
        cta: 'Try Route Planner',
        ctaPath: '/route-planner',
      },
    },
  },
  {
    label: 'Solutions',
    path: '/solutions',
    megaMenu: {
      columns: [
        {
          heading: 'FOR CONSUMERS',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              ),
              title: 'Petrol & Diesel',
              desc: 'Compare prices, find amenities, and read reviews at stations.',
              path: '/petrol',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              ),
              title: 'Rewards Program',
              desc: 'Earn points for queue reports and reviews. Redeem for fuel vouchers.',
              path: '/rewards',
            },
          ],
        },
        {
          heading: 'FOR BUSINESSES',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="22" height="18" rx="2" />
                  <path d="M1 9h22" />
                </svg>
              ),
              title: 'Fleet Management',
              desc: 'Optimize fleet refueling routes and track fuel costs across vehicles.',
              path: '/diesel/fleet',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              ),
              title: 'List Your Station',
              desc: 'Station owners: reach thousands of drivers by listing your station.',
              path: '/contact',
            },
          ],
        },
      ],
      promo: {
        image: '/images/diesel_fleet_1783050838517.png',
        tag: 'Fleet',
        title: "Reduce Fleet Refueling Costs by 35%",
        desc: 'Enterprise-grade fleet management with AI route optimization and bulk fuel pricing.',
        cta: 'Contact Sales',
        ctaPath: '/contact',
      },
    },
  },
  {
    label: 'Customer Stories',
    path: '/blog',
  },
  {
    label: 'Resources',
    path: '/resources',
    megaMenu: {
      columns: [
        {
          heading: 'LEARN',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                </svg>
              ),
              title: 'Blog',
              desc: 'Industry insights, price trends, and product updates.',
              path: '/blog',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
                </svg>
              ),
              title: 'FAQ',
              desc: 'Answers to common questions about Fuel-India.',
              path: '/contact',
            },
          ],
        },
        {
          heading: 'FUEL DATA',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
              ),
              title: 'Price Tracker',
              desc: 'Live fuel prices across 500+ Indian cities.',
              path: '/petrol/prices',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              ),
              title: 'Coverage Map',
              desc: 'Explore our station network across India.',
              path: '/ev/map',
            },
          ],
        },
      ],
    },
  },
  {
    label: 'Company',
    path: '/company',
    megaMenu: {
      columns: [
        {
          heading: 'ABOUT',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              ),
              title: 'About Us',
              desc: 'Our mission, team, and the story behind Fuel-India.',
              path: '/about',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              ),
              title: 'Contact',
              desc: 'Get in touch — partnerships, support, or just say hello.',
              path: '/contact',
            },
          ],
        },
      ],
    },
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeout = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const openDropdown = (idx) => {
    clearTimeout(dropdownTimeout.current);
    setActiveDropdown(idx);
  };

  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__container">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <img src="/images/logo.png" alt="Fuel-India" className="navbar__logo-img" />
            <span className="navbar__logo-text">Fuel-India</span>
          </Link>

          {/* Desktop Nav */}
          <div className="navbar__links">
            {navLinks.map((link, idx) => (
              <div
                key={link.label}
                className="navbar__item"
                onMouseEnter={() => link.megaMenu && openDropdown(idx)}
                onMouseLeave={() => link.megaMenu && closeDropdown()}
              >
                {link.megaMenu ? (
                  <button className={`navbar__link ${activeDropdown === idx ? 'navbar__link--active' : ''}`}>
                    {link.label}
                    <svg className="navbar__chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                ) : (
                  <Link to={link.path} className="navbar__link">{link.label}</Link>
                )}

                {/* Mega Menu Dropdown */}
                {link.megaMenu && activeDropdown === idx && (
                  <div className="megamenu" onMouseEnter={() => openDropdown(idx)} onMouseLeave={closeDropdown}>
                    <div className="megamenu__body">
                      {/* Columns */}
                      <div className="megamenu__columns">
                        {link.megaMenu.columns.map((col, ci) => (
                          <div key={ci} className="megamenu__column">
                            <div className="megamenu__heading">{col.heading}</div>
                            {col.items.map((item) => (
                              <Link key={item.title} to={item.path} className="megamenu__item">
                                <div className="megamenu__icon">{item.icon}</div>
                                <div className="megamenu__text">
                                  <div className="megamenu__title">{item.title}</div>
                                  <div className="megamenu__desc">{item.desc}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Promo Card */}
                      {link.megaMenu.promo && (
                        <div className="megamenu__promo">
                          <div className="megamenu__promo-image">
                            <img src={link.megaMenu.promo.image} alt={link.megaMenu.promo.title} />
                            <span className="megamenu__promo-tag">{link.megaMenu.promo.tag}</span>
                          </div>
                          <h4 className="megamenu__promo-title">{link.megaMenu.promo.title}</h4>
                          <p className="megamenu__promo-desc">{link.megaMenu.promo.desc}</p>
                          <Link to={link.megaMenu.promo.ctaPath} className="megamenu__promo-cta">
                            {link.megaMenu.promo.cta}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="navbar__actions">
            <Link to="/contact" className="navbar__cta">Book a Demo</Link>
            <button className="navbar__burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
        {/* Bottom accent line */}
        <div className="navbar__accent" />
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu__overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-menu__panel">
            {navLinks.map((link) => (
              <div key={link.label} className="mobile-menu__group">
                <Link to={link.megaMenu ? '#' : link.path} className="mobile-menu__title">{link.label}</Link>
                {link.megaMenu && link.megaMenu.columns.map((col, ci) => (
                  <div key={ci}>
                    <div className="mobile-menu__heading">{col.heading}</div>
                    {col.items.map((item) => (
                      <Link key={item.title} to={item.path} className="mobile-menu__link">{item.title}</Link>
                    ))}
                  </div>
                ))}
              </div>
            ))}
            <div className="mobile-menu__cta">
              <Link to="/contact" className="navbar__cta" style={{ width: '100%', textAlign: 'center' }}>Book a Demo</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
