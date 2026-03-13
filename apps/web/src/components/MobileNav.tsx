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
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
                id="mobile-menu-btn"
            >
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {open ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Mobile Menu Drawer */}
            {open && (
                <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg animate-fade-in z-50">
                    <nav className="flex flex-col p-4 gap-1">
                        <Link
                            href="/courses"
                            onClick={() => setOpen(false)}
                            className="px-4 py-3 text-base font-medium text-slate-700 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all"
                        >
                            📚 Courses
                        </Link>
                        <Link
                            href="/champions"
                            onClick={() => setOpen(false)}
                            className="px-4 py-3 text-base font-medium text-slate-700 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all"
                        >
                            🤝 Champions
                        </Link>
                        {isLoggedIn ? (
                            <Link
                                href="/home"
                                onClick={() => setOpen(false)}
                                className="px-4 py-3 text-base font-bold text-white gradient-primary rounded-xl text-center mt-2"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-3 text-base font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition-all border border-slate-200 text-center mt-2"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-3 text-base font-bold text-white gradient-primary rounded-xl text-center mt-1"
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
