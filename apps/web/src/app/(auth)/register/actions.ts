'use server'

import { redirect } from 'next/navigation';
import { db, users } from '@ally-ability/database';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function register(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const full_name = formData.get('full_name') as string;
    const role = formData.get('role') as string;
    const disability_type = formData.get('disability_type') as string;

    // Check if user exists
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
        redirect(`/register?message=Could not sign up user: Email already exists`);
    }

    // Hash password & generate ID
    const password_hash = await hash(password, 10);
    const userId = crypto.randomUUID();

    try {
        await db.insert(users).values({
            id: userId,
            email,
            password_hash,
            full_name,
            role: role as any,
            disability_type: disability_type as any
        });
    } catch (e: any) {
        redirect(`/register?message=Could not sign up user: Database Error ${e.message}`);
    }

    // "Easy Sign Up" - Instantly log them in!
    const token = await signToken({ sub: userId, email, role });
    cookies().set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });

    redirect('/home');
}
