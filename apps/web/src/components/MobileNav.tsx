'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="md:hidden">
            {/* Hamburger Button */}
            <button
                onClick={() => setOpen(!open)}
                className="p-2.5 rounded-lg hover:bg-brand-amber/10 transition-colors tap-target focus-brand"
                aria-label="Toggle menu"
                id="mobile-menu-btn"
            >
                <svg className="w-6 h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {open ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Mobile Menu Drawer */}
            {open && (
                <div className="absolute top-18 left-0 right-0 bg-ivory border-b border-brand-amber/10 shadow-lg animate-fade-in z-50">
                    <nav className="flex flex-col p-4 gap-1 font-body">
                        <Link
                            href="/courses"
                            onClick={() => setOpen(false)}
                            className="px-4 py-3 text-base font-medium text-charcoal/80 rounded-xl hover:bg-brand-amber/10 hover:text-brand-amber transition-all tap-target"
                        >
                            📚 Courses
                        </Link>
                        <Link
                            href="/champions"
                            onClick={() => setOpen(false)}
                            className="px-4 py-3 text-base font-medium text-charcoal/80 rounded-xl hover:bg-brand-amber/10 hover:text-brand-amber transition-all tap-target"
                        >
                            🤝 Champions
                        </Link>
                        <Link
                            href="/jobs"
                            onClick={() => setOpen(false)}
                            className="px-4 py-3 text-base font-medium text-charcoal/80 rounded-xl hover:bg-brand-amber/10 hover:text-brand-amber transition-all tap-target"
                        >
                            💼 Jobs
                        </Link>
                        {isLoggedIn ? (
                            <Link
                                href="/home"
                                onClick={() => setOpen(false)}
                                className="px-4 py-3 text-base font-bold text-white gradient-warm rounded-xl text-center mt-2 tap-target"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-3 text-base font-medium text-charcoal rounded-xl hover:bg-charcoal/5 transition-all border border-charcoal/15 text-center mt-2 tap-target"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-3 text-base font-bold text-white gradient-warm rounded-xl text-center mt-1 tap-target"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </div>
    );
}
