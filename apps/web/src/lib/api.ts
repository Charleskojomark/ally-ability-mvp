import { createClient } from './supabase-server';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    // Try to get the active session token to pass to the backend
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    if (session?.access_token) {
        headers.set('Authorization', `Bearer ${session.access_token}`);
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const response = await fetch(url, {
        ...options,
        headers,
        // Add cache control to ensure fresh data during dev unless specified otherwise
        cache: options.cache || 'no-store',
    });

    if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.error) {
                errorMessage = errorData.error;
            }
        } catch {
            // Not JSON
        }
        throw new Error(errorMessage);
    }

    return response.json();
}
