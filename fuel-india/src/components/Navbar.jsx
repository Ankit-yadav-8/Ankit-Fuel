import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  {
    label: 'Home',
    path: '/',
    megaMenu: {
      columns: [
        {
          heading: 'DISCOVER',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
              ),
              title: 'Overview',
              desc: 'The main landing page and platform highlights.',
              path: '/',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              ),
              title: 'How It Works',
              desc: 'Learn how we aggregate and optimize fuel data.',
              path: '/about',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
              ),
              title: 'Download App',
              desc: 'Get Fuel-India for iOS and Android devices.',
              path: '/',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              ),
              title: 'About Us',
              desc: 'Our mission, vision, and the team behind the platform.',
              path: '/about',
            },
          ],
        },
      ],
      promo: {
        image: './images/worker_portrait_1783055050874.png',
        tag: 'App',
        title: 'Fuel-India Mobile App',
        desc: 'Take the power of AI routing and live queue predictions on the road with you.',
        cta: 'Download Now',
        ctaPath: '/',
      },
    },
  },
  {
    label: 'Find Stations',
    path: '/petrol',
    megaMenu: {
      columns: [
        {
          heading: 'STATION FINDER',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              ),
              title: 'All Stations',
              desc: 'Map view of all fuel types across India.',
              path: '/petrol',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              ),
              title: 'Near Me',
              desc: 'Auto-locate nearby stations instantly.',
              path: '/petrol',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              ),
              title: 'Search by City / Area',
              desc: 'Browse stations by location and region.',
              path: '/petrol',
            },
          ],
        },
        {
          heading: 'TOOLS',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              ),
              title: 'Filter by Brand',
              desc: 'IOCL, BPCL, HPCL, private networks & EV.',
              path: '/petrol',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              ),
              title: 'Route Planner',
              desc: 'Find stations optimally along your trip.',
              path: '/route-planner',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              ),
              title: 'Saved / Favorite',
              desc: 'Access your bookmarked stations quickly.',
              path: '/rewards',
            },
          ],
        },
      ],
      promo: {
        image: './images/map_graphic_1783055080446.png',
        tag: 'Navigation',
        title: 'AI Route Planner',
        desc: 'Plan your next road trip with smart fuel stops and queue predictions.',
        cta: 'Try Route Planner',
        ctaPath: '/route-planner',
      },
    },
  },
  {
    label: 'EV',
    path: '/ev',
    megaMenu: {
      columns: [
        {
          heading: 'CHARGING',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              ),
              title: 'Find EV Charging Near Me',
              desc: 'Locate nearby chargers with real-time status.',
              path: '/ev',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
              ),
              title: 'Charging Networks',
              desc: 'Statiq, ChargeZone, Tata Power, and more.',
              path: '/ev',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="M16 6v2a2 2 0 01-2 2h-4a2 2 0 01-2-2V6" />
                  <path d="M12 10v12" />
                </svg>
              ),
              title: 'Connector Types',
              desc: 'Type 2, CCS2, and CHAdeMO chargers.',
              path: '/ev',
            },
          ],
        },
        {
          heading: 'EV TOOLS',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
              title: 'Fast vs Slow Charging',
              desc: 'Filter by DC fast chargers or AC slow chargers.',
              path: '/ev',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M8 14h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 18h.01" />
                  <path d="M12 18h.01" />
                  <path d="M16 18h.01" />
                </svg>
              ),
              title: 'Live Slot Availability',
              desc: 'Check if a charging bay is currently open.',
              path: '/ev',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              ),
              title: 'Plan an EV Road Trip',
              desc: 'Range-aware routing for electric vehicles.',
              path: '/route-planner',
            },
          ],
        },
      ],
      promo: {
        image: './images/charger_handle_1783055070397.png',
        tag: 'Charging',
        title: 'Seamless EV Payments',
        desc: 'Pay across 10+ charging networks with a single wallet.',
        cta: 'View Networks',
        ctaPath: '/ev',
      },
    },
  },
  {
    label: 'Petrol & Diesel',
    path: '/petrol',
    megaMenu: {
      columns: [
        {
          heading: 'PETROL & DIESEL',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M5 21V7l8-4v18" />
                  <path d="M19 21V11l-6-4" />
                  <path d="M9 7v1" />
                </svg>
              ),
              title: 'Find Petrol/Diesel Near Me',
              desc: 'Locate pumps nearby with live data.',
              path: '/petrol',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              ),
              title: 'Filter by Brand',
              desc: 'IOCL, BPCL, HPCL, and independent pumps.',
              path: '/petrol',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              ),
              title: "Today's Price Comparison",
              desc: 'Compare fuel prices across different stations.',
              path: '/petrol',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
              title: 'Stock/Availability Reports',
              desc: 'Know if the station has fuel before arriving.',
              path: '/petrol',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              ),
              title: 'Highway Pumps',
              desc: 'Reliable pumps for long-distance drivers.',
              path: '/petrol',
            },
          ],
        },
      ],
      promo: {
        image: './images/cng_pump_1783050817670.png',
        tag: 'Fleet',
        title: 'Diesel Fleet Management',
        desc: 'Optimize fuel costs and tracking for your transport fleet.',
        cta: 'Contact Sales',
        ctaPath: '/contact',
      },
    },
  },
  {
    label: 'CNG',
    path: '/cng',
    megaMenu: {
      columns: [
        {
          heading: 'CNG STATIONS',
          items: [
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              ),
              title: 'Find CNG Near Me',
              desc: 'Locate the nearest operating CNG pumps.',
              path: '/cng',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              ),
              title: 'Queue/Wait Time Reports',
              desc: 'Live reports of CNG queues to save you time.',
              path: '/cng',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              ),
              title: 'CNG on My Route',
              desc: 'Find CNG pumps along your travel route.',
              path: '/route-planner',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              ),
              title: 'Nearest CNG if Running Low',
              desc: 'Quick-find emergency short range routing.',
              path: '/cng',
            },
          ],
        },
      ],
      promo: {
        image: './images/ev_plugging_1783055060578.png',
        tag: 'Community',
        title: 'Earn Rewards for Queue Reports',
        desc: 'Update the live queue time for CNG pumps and earn fuel points.',
        cta: 'View Rewards',
        ctaPath: '/rewards',
      },
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
            <img src="./images/logo.png" alt="Fuel-India" className="navbar__logo-img" />
            <span className="navbar__logo-text">Fuel-India</span>
          </Link>

          {/* Desktop Nav */}
          <div className="navbar__links">
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <div 
                  key={link.label} 
                  className="navbar__item"
                  onMouseEnter={() => link.megaMenu && openDropdown(idx)}
                  onMouseLeave={() => link.megaMenu && closeDropdown()}
                >
                  {link.megaMenu ? (
                    <button className={`navbar__link ${isActive ? 'navbar__link--active' : ''} ${activeDropdown === idx ? 'navbar__link--hover' : ''}`}>
                      {link.label}
                      <svg className="navbar__chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  ) : (
                    <Link to={link.path} className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
                      {link.label}
                    </Link>
                  )}

                  {/* Mega Menu Dropdown */}
                  {link.megaMenu && activeDropdown === idx && (
                    <div className="megamenu" onMouseEnter={() => openDropdown(idx)} onMouseLeave={closeDropdown}>
                      <div className="megamenu__body">
                        {/* Columns */}
                        <div className="megamenu__columns">
                          {link.megaMenu.columns.map((col, ci) => (
                            <div key={ci} className="megamenu__column">
                              {col.heading && <div className="megamenu__heading">{col.heading}</div>}
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
                {link.megaMenu && link.megaMenu.columns.map((col, ci) => (
                  <div key={ci}>
                    {col.items.map((item) => (
                      <Link key={item.title} to={item.path} className="mobile-menu__link">{item.title}</Link>
                    ))}
                  </div>
                ))}
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
