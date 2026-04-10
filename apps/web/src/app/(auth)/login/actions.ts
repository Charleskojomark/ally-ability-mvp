'use server'

import { redirect } from 'next/navigation';
import { db, users } from '@ally-ability/database';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
        redirect(`/login?message=Could not authenticate user: Invalid email or password`);
    }

    const isValid = await compare(password, user.password_hash);
    if (!isValid) {
        redirect(`/login?message=Could not authenticate user: Invalid email or password`);
    }

    // Set JWT in cookie
    const token = await signToken({ sub: user.id, email: user.email, role: user.role });
    cookies().set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });

    redirect('/home');
}
