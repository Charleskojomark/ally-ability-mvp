import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Server-side client with service role (full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Client-side compatible client (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a client scoped to a specific user's JWT
export function createUserClient(accessToken: string) {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    });
}
