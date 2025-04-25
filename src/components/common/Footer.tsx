import React from 'react';
import { Sprout, Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <Sprout className="h-6 w-6 text-primary-600" />
              <span className="ml-2 text-lg font-display font-bold text-primary-800">YourHome.Farm</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Making home gardening simple, enjoyable, and productive for everyone.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary-600">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Features</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/gardens" className="text-sm text-gray-600 hover:text-primary-600">Garden Planning</Link></li>
              <li><Link to="/calendar" className="text-sm text-gray-600 hover:text-primary-600">Planting Calendar</Link></li>
              <li><Link to="/weather" className="text-sm text-gray-600 hover:text-primary-600">Weather Alerts</Link></li>
              <li><Link to="/recommendations" className="text-sm text-gray-600 hover:text-primary-600">AI Recommendations</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Plant Database</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Gardening Tips</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Seasonal Guides</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Community Forum</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">About Us</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} YourHome.Farm. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;