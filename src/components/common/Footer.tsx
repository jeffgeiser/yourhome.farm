import React from 'react';
import { Sprout, Github, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sprout className="h-6 w-6 text-green-600" />
            <span className="text-lg font-semibold">YourHome.Farm</span>
          </div>
          <div className="flex space-x-6">
            <Link href="https://github.com/jeffgeiser/yourhome.farm" className="text-gray-600 hover:text-gray-900">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="https://twitter.com/yourhomefarm" className="text-gray-600 hover:text-gray-900">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="mailto:contact@yourhome.farm" className="text-gray-600 hover:text-gray-900">
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} YourHome.Farm. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;