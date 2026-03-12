import { fetchApi } from '@/lib/api';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { BarChart3 } from 'lucide-react';
import AnalyticsViewer from './AnalyticsViewer';

export default async function AdminAnalyticsPage() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) redirect('/login');

    const role = session.user.user_metadata?.role;
    if (role !== 'admin') redirect('/home');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let partners: any[] = [];
    try {
        partners = await fetchApi('/widget/partners');
    } catch (error) {
        console.error('Failed to fetch partners', error);
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <BarChart3 className="text-primary w-8 h-8" /> Partner Analytics
                </h1>
                <p className="text-slate-600">
                    View widget usage analytics for registered API partners.
                </p>
            </div>

            {partners.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
                    <p className="text-slate-500">No partners registered yet.</p>
                </div>
            ) : (
                <AnalyticsViewer partners={partners} />
            )}
        </div>
    );
}
