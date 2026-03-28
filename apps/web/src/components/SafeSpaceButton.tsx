'use client';

import { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import SafeSpaceForm from './SafeSpaceForm';

export default function SafeSpaceButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-16 right-4 sm:bottom-24 sm:right-6 z-[40] bg-brand-green/10 text-brand-green p-2.5 sm:p-3.5 rounded-full shadow-lg hover:bg-brand-green/20 hover:scale-105 transition-all flex items-center justify-center border-2 border-brand-green/20 animate-pulse-soft tap-target focus-brand"
                aria-label="Safe Space Report"
                title="Report an issue or harassment"
            >
                <ShieldAlert className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
                    <div className="bg-ivory rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-4 py-3 border-b border-brand-green/10 flex justify-between items-center bg-brand-green/5">
                            <span className="font-heading font-bold text-sm text-brand-green uppercase tracking-wider">🛡️ Safe Space</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 text-charcoal/40 hover:text-charcoal hover:bg-charcoal/10 rounded-full transition-colors tap-target"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <SafeSpaceForm onCompletion={() => setIsOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
