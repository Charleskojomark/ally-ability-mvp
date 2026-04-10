import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const sessionToken = cookies().get('session')?.value;

    if (!sessionToken) {
        return NextResponse.json({ session: null }, { status: 401 });
    }

    return NextResponse.json({
        session: {
            access_token: sessionToken
        }
    });
}
