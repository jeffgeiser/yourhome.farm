import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Leaf, Sun, Cloud, Calendar, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Garden Background */}
      <section 
        className="w-full min-h-screen bg-[url('https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg')] bg-cover bg-center"
      >
        <div className="container px-4 md:px-6 mx-auto relative min-h-screen flex items-center">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="flex flex-col items-start space-y-4 relative max-w-[600px]">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold tracking-tighter text-white">
                Your Garden,{' '}
                <span className="text-[#90C290]">Smarter</span>
              </h1>
              <p className="text-xl text-gray-100">
                Transform your home garden with AI-powered insights, personalized
                planning tools, and real-time weather alerts. Grow more with less effort.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" className="bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold">
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="link" size="lg" className="text-white hover:text-gray-200">
                <Link href="/login">
                  Already have an account?
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-white shadow-sm">
              <div className="p-2 bg-green-100 rounded-full">
                <Leaf className="h-6 w-6 text-[#4CAF50]" />
              </div>
              <h3 className="text-xl font-bold">Personalized Plant Care</h3>
              <p className="text-center text-gray-600">
                AI-generated care instructions based on your specific garden and plants.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-white shadow-sm">
              <div className="p-2 bg-blue-100 rounded-full">
                <Cloud className="h-6 w-6 text-[#007BFF]" />
              </div>
              <h3 className="text-xl font-bold">Weather Alerts</h3>
              <p className="text-center text-gray-600">
                Get notified about frost, excessive heat, or other weather events that affect your garden.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-white shadow-sm">
              <div className="p-2 bg-amber-100 rounded-full">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold">Garden Calendar</h3>
              <p className="text-center text-gray-600">
                Keep track of planting dates, tasks, and harvests with an easy-to-use calendar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Gardeners Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The AI recommendations have transformed my garden. I've never had such healthy plants and abundant harvests!"
              </p>
              <div className="text-sm">
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-gray-500">Urban Gardener</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The weather alerts have saved my plants multiple times. This app is a must-have for any serious gardener."
              </p>
              <div className="text-sm">
                <p className="font-semibold">Michael Chen</p>
                <p className="text-gray-500">Home Grower</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "As a beginner, this app has given me the confidence to start and maintain my first vegetable garden."
              </p>
              <div className="text-sm">
                <p className="font-semibold">Emily Rodriguez</p>
                <p className="text-gray-500">Novice Gardener</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-[#4CAF50] text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                Ready to grow your best garden yet?
              </h2>
              <p className="mx-auto max-w-[600px] text-white/80 md:text-xl">
                Join thousands of gardeners using AI to grow better.
              </p>
            </div>
            <Button asChild size="lg" className="bg-white text-[#4CAF50] hover:bg-gray-100 font-bold">
              <Link href="/signup">
                Start Your Garden Journey Today
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}