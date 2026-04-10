import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AuthDebugger() {
    const supabase = createClient();
    const user = null; // Removed auth debugger dependencies

    if (!user) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm my-4">
                Not authenticated.
            </div>
        );
    }

    return (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm my-4">
            <p className="font-bold">Authenticated as:</p>
            <ul className="list-disc pl-5 mt-2">
                <li>Email: {user.email}</li>
                <li>Name: {user.user_metadata?.full_name || 'N/A'}</li>
                <li>Role: {user.user_metadata?.role || 'N/A'}</li>
            </ul>
            <form action={async () => {
                'use server'
                await fetch('/api/auth/logout', { method: 'POST' });
                redirect('/');
            }}>
                <button className="mt-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Sign Out</button>
            </form>
        </div>
    );
}
