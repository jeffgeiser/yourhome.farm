import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Grow Your Garden
            <span className="text-green-600"> Smarter</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personal garden management assistant. Track plants, get care reminders, and grow your garden with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/signup">
                Get Started
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything You Need to Grow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Plant Management</h3>
              <p className="text-gray-600">
                Track all your plants in one place. Get personalized care instructions and growth tracking.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Smart Scheduling</h3>
              <p className="text-gray-600">
                Never miss a watering or fertilizing schedule. Get AI-powered care reminders.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Weather Alerts</h3>
              <p className="text-gray-600">
                Get notified about weather conditions that might affect your plants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Grow Your Garden?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of gardeners who are growing smarter with our platform.
          </p>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
            <Link href="/signup">
              Start Your Garden Journey
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}