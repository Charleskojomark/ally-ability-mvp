/* eslint-disable @next/next/no-img-element */
import { fetchApi } from '@/lib/api';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Star, Award, ShieldCheck } from 'lucide-react';

export default async function ChampionsPage() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    // Fetch available champions directly via internal Next.js node fetch or just proxy the API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let champions: any[] = [];
    try {
        champions = await fetchApi('/champions');
    } catch (error) {
        console.error('Failed to fetch champions', error);
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Award className="text-primary w-8 h-8" /> Find a Champion
                </h1>
                <p className="text-slate-600 text-lg">
                    Connect 1-on-1 with vetted professionals who volunteer their time to mentor and guide learners on their tech journey.
                </p>
            </div>

            {champions.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
                    <p className="text-slate-500">No champions are currently available. Please check back later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {champions.map((champion) => (
                        <Link
                            href={`/champions/${champion.id}`}
                            key={champion.id}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group group-focus:ring-2 focus:ring-primary outline-none"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border-2 border-transparent group-hover:border-primary transition-colors overflow-hidden">
                                            {champion.users?.avatar_url ? (
                                                <img src={champion.users.avatar_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl font-bold text-slate-400">
                                                    {champion.users?.full_name?.charAt(0) || '?'}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800 leading-tight">
                                                {champion.users?.full_name || 'Anonymous Champion'}
                                            </h3>
                                            <div className="flex items-center gap-1 mt-1 text-yellow-500 font-medium text-sm">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span>{champion.rating > 0 ? champion.rating : 'New'}</span>
                                                <span className="text-slate-400 font-normal ml-1">
                                                    ({champion.total_sessions} sessions)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-slate-600 text-sm line-clamp-3 mb-4 min-h-[60px]">
                                    {champion.bio || 'This champion has not written a bio yet but is ready to help!'}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {champion.specialisations?.slice(0, 3).map((spec: string, i: number) => (
                                        <span key={i} className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold">
                                            {spec}
                                        </span>
                                    ))}
                                    {champion.specialisations?.length > 3 && (
                                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                                            +{champion.specialisations.length - 3}
                                        </span>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                                        <ShieldCheck className="w-4 h-4 text-green-500" /> Vetted
                                    </span>
                                    <span className="text-primary font-bold text-sm bg-primary/5 px-3 py-1.5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                        View Profile
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
