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
                className="fixed bottom-16 right-4 sm:bottom-24 sm:right-6 z-[40] bg-red-100 text-red-700 p-2.5 sm:p-3.5 rounded-full shadow-lg hover:bg-red-200 hover:scale-105 transition-all flex items-center justify-center border-2 border-red-200"
                aria-label="Safe Space Report"
                title="Report an issue or harassment"
            >
                <ShieldAlert className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-4 py-3 border-b flex justify-between items-center bg-slate-50">
                            <span className="font-bold text-sm text-slate-500 uppercase tracking-wider">Moderation Core</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
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
