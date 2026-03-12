import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function AuthDebugger() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

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
                const supabase = createClient();
                await supabase.auth.signOut();
                redirect('/');
            }}>
                <button className="mt-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Sign Out</button>
            </form>
        </div>
    );
}
