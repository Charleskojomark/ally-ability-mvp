import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db, users } from '@ally-ability/database';
import { eq } from 'drizzle-orm';

const secretKey = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';
const key = new TextEncoder().encode(secretKey);

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) return null;

    const payload = await verifyToken(sessionCookie);
    if (!payload?.sub) return null;

    try {
        // Fetch fresh user data from Turso
        const userRecs = await db.select().from(users).where(eq(users.id, payload.sub as string)).limit(1);
        if (userRecs.length === 0) return null;

        return {
            user: {
                id: userRecs[0].id,
                email: userRecs[0].email,
                user_metadata: {
                    full_name: userRecs[0].full_name,
                    role: userRecs[0].role,
                }
            }
        };
    } catch (e) {
        return null;
    }
}
