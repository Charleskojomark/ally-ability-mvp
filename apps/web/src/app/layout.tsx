import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import AccessibilityToolbar from '@/components/AccessibilityToolbar';
import SafeSpaceButton from '@/components/SafeSpaceButton';
import AllyChatbot from '@/components/AllyChatbot';
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import MobileNav from '@/components/MobileNav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

import { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#6366f1',
};

export const metadata: Metadata = {
  title: 'The Ally-Ability Network',
  description: 'Inclusive learning platform for women, persons with disabilities, and teachers',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ally-Ability',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en" className={inter.variable}>
      <AccessibilityProvider initialSession={session}>
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <header className="glass sticky top-0 z-50 border-b border-white/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group shrink-0" id="nav-logo">
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <span className="text-white font-extrabold text-sm">A</span>
                  </div>
                  <span className="text-lg font-bold text-slate-800 hidden sm:block">
                    Ally-Ability
                  </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-2">
                  <Link href="/courses" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all" id="nav-courses">
                    Courses
                  </Link>
                  <Link href="/champions" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all" id="nav-champions">
                    Champions
                  </Link>
                  {session ? (
                    <Link href="/home" className="ml-2 px-4 py-2 text-sm font-semibold text-white gradient-primary rounded-xl hover:shadow-lg hover:scale-105 transition-all" id="nav-dashboard">
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" className="ml-2 px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-white hover:shadow-sm transition-all" id="nav-login">
                        Sign In
                      </Link>
                      <Link href="/register" className="px-4 py-2 text-sm font-semibold text-white gradient-primary rounded-xl hover:shadow-lg hover:scale-105 transition-all" id="nav-register">
                        Get Started
                      </Link>
                    </>
                  )}
                </nav>

                {/* Mobile Nav */}
                <MobileNav isLoggedIn={!!session} />
              </div>
            </header>

            <main className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200/60 bg-white/50 py-6 sm:py-8 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                      <span className="text-white font-bold text-xs">A</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-600">Ally-Ability Network</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    &copy; 2026 The Ally-Ability Network. Inclusive learning for all.
                  </p>
                </div>
              </div>
            </footer>
          </div>
          <AllyChatbot />
          <SafeSpaceButton />
          <AccessibilityToolbar />
        </body>
      </AccessibilityProvider>
    </html>
  );
}
