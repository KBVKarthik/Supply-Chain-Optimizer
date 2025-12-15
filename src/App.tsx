import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { RouteOptimizationPage } from './pages/RouteOptimizationPage';
import { QualityPage } from './pages/QualityPage';
// import { RecommendationsPage } from './pages/RecommendationsPage';
// import { InventoryPage } from './pages/InventoryPage';
import {
  BarChart3 as Analytics,
  Navigation,
  CheckCircle,
  Lightbulb,
  Package,
  Menu,
  X,
} from 'lucide-react';

const Navigation_Component: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { path: '/', label: 'Dashboard', icon: Analytics },
    { path: '/routes', label: 'Route Optimization', icon: Navigation },
    // { path: '/inventory', label: 'Inventory', icon: Package },
    { path: '/quality', label: 'Quality Management', icon: CheckCircle },
    // { path: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">⚡ SCO</div>
            <span className="text-sm opacity-90">Supply Chain Optimizer</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1">
            {links.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  location.pathname === path
                    ? 'bg-blue-800 text-white'
                    : 'hover:bg-blue-500 text-blue-100'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {links.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  location.pathname === path
                    ? 'bg-blue-800 text-white'
                    : 'hover:bg-blue-500 text-blue-100'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation_Component />
        <main>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/routes" element={<RouteOptimizationPage />} />
            {/* <Route path="/inventory" element={<InventoryPage />} /> */}
            <Route path="/quality" element={<QualityPage />} />
            {/* <Route path="/recommendations" element={<RecommendationsPage />} /> */}
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-400 py-8 mt-12 text-center">
          <p>&copy; 2024 Supply Chain Optimizer. Advanced logistics optimization platform.</p>
          <p className="text-sm mt-2">Featuring route optimization, quality management, and AI recommendations</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
