import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import AccessibilityToolbar from '@/components/AccessibilityToolbar';
import SafeSpaceButton from '@/components/SafeSpaceButton';
import AllyChatbot from '@/components/AllyChatbot';
import { createClient } from '@/lib/supabase-server';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en">
      <AccessibilityProvider initialSession={session}>
        <body className={inter.className}>
          <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top navigation placeholder */}
            <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 sticky top-0 z-50">
              <h1 className="text-xl font-bold text-slate-800">Ally-Ability Network</h1>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto p-6">
              {children}
            </main>
          </div>
          <AllyChatbot />
          <SafeSpaceButton />
          <AccessibilityToolbar />
        </body>
      </AccessibilityProvider>
    </html>
  );
}
