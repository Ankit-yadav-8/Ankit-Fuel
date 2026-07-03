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

function App() {
  return (
    <Router>
      <ScrollToTop />
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
