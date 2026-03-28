'use client';

import { useState } from 'react';
import { Settings, X, Type, Contrast, MonitorUp } from 'lucide-react';
import { useAccessibility } from './AccessibilityProvider';

export default function AccessibilityToolbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { highContrast, dyslexicFont, textSize, updatePreference } = useAccessibility();

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-28 right-4 sm:bottom-6 sm:right-6 z-50 bg-brand-amber text-white p-2.5 sm:p-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center border-2 sm:border-4 border-white ring-2 sm:ring-4 ring-brand-amber/20 tap-target focus-brand"
                aria-label="Open Accessibility Toolbar"
                title="Accessibility Tools"
            >
                <Settings className="w-4 h-4 sm:w-6 sm:h-6 animate-[spin_4s_linear_infinite]" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 w-[calc(100%-2rem)] sm:w-80 bg-ivory border-2 border-brand-amber/20 shadow-2xl rounded-2xl overflow-hidden animate-slide-in-left">
            <div className="bg-brand-amber/10 p-4 border-b border-brand-amber/10 flex justify-between items-center text-charcoal">
                <h2 className="font-heading font-bold flex items-center gap-2">
                    <MonitorUp className="w-5 h-5 text-brand-amber" />
                    Accessibility Tools
                </h2>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-brand-amber/10 rounded text-charcoal/50 tap-target"
                    aria-label="Close Toolbar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-5 flex flex-col gap-6">

                {/* Dyslexia Font Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-green/10 text-brand-green rounded-lg"><Type className="w-5 h-5" /></div>
                        <div>
                            <div className="font-body font-semibold text-sm text-charcoal">Dyslexia Friendly</div>
                            <div className="text-xs text-charcoal/50 font-body">Atkinson Hyperlegible</div>
                        </div>
                    </div>
                    <button
                        onClick={() => updatePreference('dyslexicFont', !dyslexicFont)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${dyslexicFont ? 'bg-brand-green' : 'bg-charcoal/20'}`}
                        role="switch"
                        aria-checked={dyslexicFont}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${dyslexicFont ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                </div>

                {/* High Contrast Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-amber/10 text-brand-amber rounded-lg"><Contrast className="w-5 h-5" /></div>
                        <div>
                            <div className="font-body font-semibold text-sm text-charcoal">High Contrast</div>
                            <div className="text-xs text-charcoal/50 font-body">AAA WCAG Colors</div>
                        </div>
                    </div>
                    <button
                        onClick={() => updatePreference('highContrast', !highContrast)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${highContrast ? 'bg-brand-amber' : 'bg-charcoal/20'}`}
                        role="switch"
                        aria-checked={highContrast}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${highContrast ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                </div>

                <hr className="border-brand-amber/10" />

                {/* Text Size Slider/Selector */}
                <div className="flex flex-col gap-3">
                    <div className="font-body font-semibold text-sm text-charcoal flex items-center justify-between">
                        Text Size
                        <span className="text-xs text-charcoal/50 font-normal capitalize bg-brand-amber/10 px-2 py-0.5 rounded-full">{textSize}</span>
                    </div>
                    <div className="flex bg-brand-amber/5 p-1 rounded-lg border border-brand-amber/10">
                        {(['normal', 'large', 'xlarge'] as const).map((size) => (
                            <button
                                key={size}
                                onClick={() => updatePreference('textSize', size)}
                                className={`flex-1 py-1.5 text-sm font-body font-medium rounded-md capitalize transition-colors tap-target ${textSize === size ? 'bg-white shadow-sm text-brand-amber font-bold' : 'text-charcoal/60 hover:text-charcoal'
                                    }`}
                            >
                                {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
