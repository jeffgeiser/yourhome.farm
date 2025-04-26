import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Home, Calendar, Sprout, Cloud, User } from 'lucide-react';
import useGardenStore from '../../store/useGardenStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const weatherAlerts = useGardenStore(state => state.weatherAlerts);
  const unreadAlerts = weatherAlerts.filter(alert => !alert.read).length;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigation = [
    { name: 'Dashboard', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Gardens', path: '/gardens', icon: <Sprout className="h-5 w-5" /> },
    { name: 'Calendar', path: '/calendar', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Weather', path: '/weather', icon: <Cloud className="h-5 w-5" /> },
    { name: 'Account', path: '/account', icon: <User className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <Sprout className="h-8 w-8 text-primary-600 animate-leaf-sway" />
              <span className="ml-2 text-xl font-display font-bold text-primary-800">YourHome.Farm</span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Notification Bell */}
          <div className="flex items-center">
            <Link to="/notifications" className="relative mr-4 p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Bell className="h-6 w-6" />
              {unreadAlerts > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-error-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unreadAlerts}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.path)
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;