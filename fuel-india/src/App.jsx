import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import EVPage from './pages/EVPage';
import CNGPage from './pages/CNGPage';
import PetrolPage from './pages/PetrolPage';
import DieselPage from './pages/DieselPage';
import RoutePlanner from './pages/RoutePlanner';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Rewards from './pages/Rewards';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Adds a fade-up reveal animation to common blocks as they scroll into view.
const REVEAL_SELECTOR = [
  '.section__header', '.product-card', '.solution-card', '.feature-card',
  '.blog-card', '.blog-featured', '.mission-card', '.value-card', '.team-card',
  '.timeline-item', '.office-card', '.faq-item', '.reward-earn-card',
  '.tier-card', '.redeem-card', '.impact-card', '.stat-card', '.step-card',
  '.split-layout', '.testimonial-ionage', '.price-card', '.newsletter',
  '.cta-card', '.stats-bar__item', '.leaderboard', '.contact-form-wrap',
].join(', ');

function RevealOnScroll() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    let staggerIndex = 0;
    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
      if (el.classList.contains('reveal--visible')) return;
      el.classList.add('reveal');
      el.style.transitionDelay = `${(staggerIndex % 4) * 80}ms`;
      staggerIndex += 1;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <RevealOnScroll />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ev" element={<EVPage />} />
          <Route path="/ev/*" element={<EVPage />} />
          <Route path="/cng" element={<CNGPage />} />
          <Route path="/cng/*" element={<CNGPage />} />
          <Route path="/petrol" element={<PetrolPage />} />
          <Route path="/petrol/*" element={<PetrolPage />} />
          <Route path="/diesel" element={<DieselPage />} />
          <Route path="/diesel/*" element={<DieselPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/route-planner" element={<RoutePlanner />} />
          <Route path="/queue-predictor" element={<CNGPage />} />
          <Route path="/privacy" element={<About />} />
          <Route path="/terms" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
