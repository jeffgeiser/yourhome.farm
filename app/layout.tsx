import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { SupabaseProvider } from '@/components/supabase-provider';
import Navbar from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YourHome.Farm - AI-Powered Garden Management',
  description: 'Manage your home garden with AI-powered personalized care plans and advice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SupabaseProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 bg-[#F0F2F5]">{children}</main>
              <footer className="bg-white py-4 px-6 border-t">
                <div className="container mx-auto text-center text-sm text-gray-500">
                  © {new Date().getFullYear()} YourHome.Farm. All rights reserved.
                </div>
              </footer>
            </div>
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}