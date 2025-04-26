import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sprout, Sun, Calendar, Cloud, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="min-h-screen bg-white">
          {/* Navigation */}
          <nav className="absolute top-0 left-0 right-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center h-12">
                  <div className="relative">
                    <Sprout className="h-8 w-8 text-primary-300 animate-leaf-sway" />
                  </div>
                  <div className="ml-2 font-display font-bold text-white text-2xl">
                    YourHome<span className="text-primary-600">.Farm</span>
                  </div>
                </div>
                <Button className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                  Sign In
                </Button>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg" 
                alt="Garden background" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/70" />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 lg:pt-40 lg:pb-32">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-7">
                  <h1 className="text-4xl font-display font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                    Your Garden,
                    <br />
                    <span className="text-primary-300">Smarter</span>
                  </h1>
                  <p className="mt-6 text-xl text-gray-100 max-w-3xl">
                    Transform your home garden with AI-powered insights, personalized planning tools, and real-time weather alerts. Grow more with less effort.
                  </p>
                  <div className="mt-10 flex items-center gap-x-6">
                    <Button className="text-lg px-8 py-3 flex items-center">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button variant="link" className="text-lg font-medium text-white hover:text-primary-200">
                      Already have an account?
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold text-gray-900 sm:text-4xl">
                  Everything you need to grow successfully
                </h2>
                <p className="mt-4 text-xl text-gray-600">
                  Powerful tools and smart features to make gardening easier and more rewarding.
                </p>
              </div>
              <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                    <Sun className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Garden Planning</h3>
                  <p className="text-gray-600">
                    Design and manage your garden spaces with intuitive tools and plant recommendations.
                  </p>
                </div>

                <div className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Planting Calendar</h3>
                  <p className="text-gray-600">
                    Never miss a planting date with personalized schedules and reminders.
                  </p>
                </div>

                <div className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                    <Cloud className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Weather Alerts</h3>
                  <p className="text-gray-600">
                    Receive real-time weather notifications to protect your garden.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="bg-gray-50 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-display font-bold text-center text-gray-900 mb-12">
                Loved by home gardeners
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <p className="text-gray-600 italic mb-4">
                    "This app has transformed my home garden. The AI recommendations are spot-on!"
                  </p>
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">Sarah M.</p>
                      <p className="text-sm text-gray-500">Urban Gardener</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <p className="text-gray-600 italic mb-4">
                    "The weather alerts have saved my plants multiple times. Absolutely essential."
                  </p>
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">Michael R.</p>
                      <p className="text-sm text-gray-500">Home Farmer</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <p className="text-gray-600 italic mb-4">
                    "Perfect for beginners. I finally have a thriving vegetable garden!"
                  </p>
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">Lisa K.</p>
                      <p className="text-sm text-gray-500">Hobby Gardener</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary-900 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold text-white mb-4">
                  Ready to start growing?
                </h2>
                <p className="text-xl text-primary-100 mb-8">
                  Join thousands of successful home gardeners today.
                </p>
                <Button className="bg-white text-primary-900 hover:bg-primary-50 text-lg px-8 py-3">
                  Get Started Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}