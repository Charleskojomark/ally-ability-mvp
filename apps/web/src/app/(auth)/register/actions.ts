'use server'

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase-server';

export async function register(formData: FormData) {
    const origin = process.env.NEXT_PUBLIC_APP_URL || headers().get('origin') || 'http://localhost:3000';
    const supabase = createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const full_name = formData.get('full_name') as string;
    const role = formData.get('role') as string;
    const disability_type = formData.get('disability_type') as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                full_name,
                role,
                disability_type
            }
        },
    });

    if (error) {
        redirect(`/register?message=Could not sign up user: ${error.message}`);
    }

    // Next.js actions should return redirect
    return redirect('/login?message=Check email to continue sign in process. (Or just sign in if Email Confirmations are disabled directly in Supabase)');
}
