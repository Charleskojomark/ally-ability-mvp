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
                className="fixed bottom-28 right-4 sm:bottom-6 sm:right-6 z-50 bg-primary text-primary-foreground p-2.5 sm:p-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center border-2 sm:border-4 border-white"
                aria-label="Open Accessibility Toolbar"
                title="Accessibility Tools"
            >
                <Settings className="w-4 h-4 sm:w-6 sm:h-6 animate-[spin_4s_linear_infinite]" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-80 bg-card border-2 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="bg-slate-100 p-4 border-b flex justify-between items-center text-slate-800">
                <h2 className="font-bold flex items-center gap-2">
                    <MonitorUp className="w-5 h-5 text-primary" />
                    Accessibility Tools
                </h2>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500"
                    aria-label="Close Toolbar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-5 flex flex-col gap-6">

                {/* Dyslexia Font Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Type className="w-5 h-5" /></div>
                        <div>
                            <div className="font-semibold text-sm">Dyslexia Friendly</div>
                            <div className="text-xs text-muted-foreground">OpenDyslexic Font</div>
                        </div>
                    </div>
                    <button
                        onClick={() => updatePreference('dyslexicFont', !dyslexicFont)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${dyslexicFont ? 'bg-primary' : 'bg-slate-300'}`}
                        role="switch"
                        aria-checked={dyslexicFont}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${dyslexicFont ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                </div>

                {/* High Contrast Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 text-amber-700 rounded-lg"><Contrast className="w-5 h-5" /></div>
                        <div>
                            <div className="font-semibold text-sm">High Contrast</div>
                            <div className="text-xs text-muted-foreground">AAA WCAG Colors</div>
                        </div>
                    </div>
                    <button
                        onClick={() => updatePreference('highContrast', !highContrast)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${highContrast ? 'bg-primary' : 'bg-slate-300'}`}
                        role="switch"
                        aria-checked={highContrast}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                </div>

                <hr />

                {/* Text Size Slider/Selector */}
                <div className="flex flex-col gap-3">
                    <div className="font-semibold text-sm flex items-center justify-between">
                        Text Size
                        <span className="text-xs text-muted-foreground font-normal capitalize bg-slate-100 px-2 py-0.5 rounded-full">{textSize}</span>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {(['normal', 'large', 'xlarge'] as const).map((size) => (
                            <button
                                key={size}
                                onClick={() => updatePreference('textSize', size)}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${textSize === size ? 'bg-white shadow-sm text-primary font-bold' : 'text-slate-600 hover:text-slate-900'
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
