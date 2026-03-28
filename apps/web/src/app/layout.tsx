import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import AccessibilityToolbar from '@/components/AccessibilityToolbar';
import SafeSpaceButton from '@/components/SafeSpaceButton';
import AllyChatbot from '@/components/AllyChatbot';
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import MobileNav from '@/components/MobileNav';
import Image from 'next/image';

import { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#E8820C',
};

export const metadata: Metadata = {
  title: 'The Ally-Ability Network — Learn. Grow. Earn.',
  description: 'An inclusive digital learning and job platform empowering women, persons with disabilities, and teachers in Nigeria with digital skills, safe spaces, and remote work opportunities.',
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
    <html lang="en">
      <AccessibilityProvider initialSession={session}>
        <body>
          <div className="min-h-screen flex flex-col">
            {/* ─── Header ─── */}
            <header className="glass-warm sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group shrink-0" id="nav-logo">
                  <Image src="/logo.png" alt="Ally-Ability Network" width={44} height={44} className="group-hover:scale-105 transition-transform" />
                  <span className="text-lg font-heading font-bold text-charcoal dark:text-ivory hidden sm:block">
                    Ally-Ability
                  </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                  <Link href="/courses" className="px-4 py-2 text-sm font-body font-medium text-charcoal/70 hover:text-brand-amber rounded-lg hover:bg-brand-amber/10 transition-all tap-target focus-brand" id="nav-courses">
                    Courses
                  </Link>
                  <Link href="/champions" className="px-4 py-2 text-sm font-body font-medium text-charcoal/70 hover:text-brand-amber rounded-lg hover:bg-brand-amber/10 transition-all tap-target focus-brand" id="nav-champions">
                    Champions
                  </Link>
                  <Link href="/jobs" className="px-4 py-2 text-sm font-body font-medium text-charcoal/70 hover:text-brand-amber rounded-lg hover:bg-brand-amber/10 transition-all tap-target focus-brand" id="nav-jobs">
                    Jobs
                  </Link>
                  {session ? (
                    <Link href="/home" className="ml-3 px-5 py-2.5 text-sm font-body font-semibold text-white gradient-warm rounded-xl hover:shadow-lg hover:scale-105 transition-all tap-target focus-brand" id="nav-dashboard">
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" className="ml-3 px-5 py-2.5 text-sm font-body font-medium text-charcoal border border-charcoal/20 rounded-xl hover:bg-charcoal/5 transition-all tap-target focus-brand" id="nav-login">
                        Sign In
                      </Link>
                      <Link href="/register" className="px-5 py-2.5 text-sm font-body font-semibold text-white gradient-warm rounded-xl hover:shadow-lg hover:scale-105 transition-all tap-target focus-brand" id="nav-register">
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

            {/* ─── Footer ─── */}
            <footer className="bg-charcoal text-ivory/80 pt-16 pb-8 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                  {/* Brand */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Image src="/logo.png" alt="Ally-Ability" width={36} height={36} />
                      <span className="font-heading font-bold text-ivory text-lg">Ally-Ability</span>
                    </div>
                    <p className="text-sm text-ivory/60 leading-relaxed font-body">
                      Inclusive digital learning and employment platform for women, persons with disabilities, and teachers in Nigeria.
                    </p>
                  </div>

                  {/* Platform */}
                  <div>
                    <h4 className="font-heading font-semibold text-ivory text-sm uppercase tracking-wider mb-4">Platform</h4>
                    <ul className="space-y-2.5">
                      <li><Link href="/courses" className="text-sm text-ivory/60 hover:text-brand-amber transition-colors font-body">Courses</Link></li>
                      <li><Link href="/champions" className="text-sm text-ivory/60 hover:text-brand-amber transition-colors font-body">Champions</Link></li>
                      <li><Link href="/jobs" className="text-sm text-ivory/60 hover:text-brand-amber transition-colors font-body">Job Board</Link></li>
                      <li><Link href="/widget" className="text-sm text-ivory/60 hover:text-brand-amber transition-colors font-body">Ally Widget</Link></li>
                    </ul>
                  </div>

                  {/* Support */}
                  <div>
                    <h4 className="font-heading font-semibold text-ivory text-sm uppercase tracking-wider mb-4">Support</h4>
                    <ul className="space-y-2.5">
                      <li><Link href="/register" className="text-sm text-ivory/60 hover:text-brand-amber transition-colors font-body">Create Account</Link></li>
                      <li><Link href="/login" className="text-sm text-ivory/60 hover:text-brand-amber transition-colors font-body">Sign In</Link></li>
                    </ul>
                  </div>

                  {/* Accessibility */}
                  <div>
                    <h4 className="font-heading font-semibold text-ivory text-sm uppercase tracking-wider mb-4">Accessibility</h4>
                    <ul className="space-y-2.5">
                      <li className="text-sm text-ivory/60 font-body">🤟 NSL Support</li>
                      <li className="text-sm text-ivory/60 font-body">📖 Dyslexia Font</li>
                      <li className="text-sm text-ivory/60 font-body">🔲 High Contrast</li>
                      <li className="text-sm text-ivory/60 font-body">🔊 Screen Reader</li>
                    </ul>
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-ivory/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <p className="text-xs text-ivory/40 font-body">
                    &copy; 2026 The Ally-Ability Network. Building inclusive futures.
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-ivory/40 font-body">Made with ❤️ in Nigeria</span>
                  </div>
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
