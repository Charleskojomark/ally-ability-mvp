'use client';

import { createContext, useContext, useEffect, useState } from 'react';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

type TextSize = 'normal' | 'large' | 'xlarge';

export interface AccessibilityPreferences {
    highContrast: boolean;
    dyslexicFont: boolean;
    textSize: TextSize;
}

interface AccessibilityContextType extends AccessibilityPreferences {
    updatePreference: <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => void;
    isLoading: boolean;
}

const defaultPreferences: AccessibilityPreferences = {
    highContrast: false,
    dyslexicFont: false,
    textSize: 'normal',
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

import { Session } from '@supabase/supabase-js';

export function AccessibilityProvider({ children, initialSession }: { children: React.ReactNode, initialSession?: Session | null }) {
    const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Initial Load: Try backend if logged in, otherwise localStorage
    useEffect(() => {
        async function initPreferences() {
            setIsLoading(true);
            if (initialSession) {
                try {
                    const res = await fetch(`${API_BASE_URL}/users/preferences`, {
                        headers: {
                            'Authorization': `Bearer ${initialSession.access_token}`
                        }
                    });
                    if (!res.ok) throw new Error('Failed to fetch');
                    const data = await res.json();
                    setPreferences(data);
                    // Sync to cache for speed
                    localStorage.setItem('ally_prefs', JSON.stringify(data));
                } catch {
                    console.error('Failed to load DB preferences, falling back to local');
                    loadLocalPrefs();
                }
            } else {
                loadLocalPrefs();
            }
            setIsLoading(false);
        }

        function loadLocalPrefs() {
            const stored = localStorage.getItem('ally_prefs');
            if (stored) {
                try {
                    setPreferences(JSON.parse(stored));
                } catch { }
            }
        }

        initPreferences();
    }, [initialSession]);

    // 2. Apply CSS classes to <body> whenever preferences change
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const body = document.body;

        // Reset all previous accessibility classes
        body.classList.remove('high-contrast', 'font-dyslexic', 'text-large', 'text-xlarge');

        // Apply current classes
        if (preferences.highContrast) body.classList.add('high-contrast');
        if (preferences.dyslexicFont) body.classList.add('font-dyslexic');
        if (preferences.textSize !== 'normal') body.classList.add(`text-${preferences.textSize}`);

    }, [preferences]);

    // 3. Update function
    const updatePreference = async <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => {
        const newPrefs = { ...preferences, [key]: value };
        setPreferences(newPrefs);

        // Always save locally immediately
        localStorage.setItem('ally_prefs', JSON.stringify(newPrefs));

        // If logged in, push to DB asynchronously
        if (initialSession) {
            try {
                await fetch(`${API_BASE_URL}/users/preferences`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${initialSession.access_token}`
                    },
                    body: JSON.stringify({ preferences: newPrefs }),
                });
            } catch {
                console.error('Failed to save preference to DB');
            }
        }
    };

    return (
        <AccessibilityContext.Provider value={{ ...preferences, updatePreference, isLoading }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
}
