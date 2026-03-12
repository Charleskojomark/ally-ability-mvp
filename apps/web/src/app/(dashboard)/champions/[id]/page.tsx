/* eslint-disable @next/next/no-img-element */
import { fetchApi } from '@/lib/api';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, Calendar, MessageSquare, Clock, Globe } from 'lucide-react';
import BookingForm from './BookingForm';

export default async function ChampionProfilePage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let champion: any = null;
    try {
        champion = await fetchApi(`/champions/${params.id}`);
    } catch (error) {
        console.error('Failed to fetch champion', error);
    }

    if (!champion) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Champion not found</h1>
                <Link href="/champions" className="text-primary font-medium hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Directory
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <Link href="/champions" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Champions
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
                            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border-4 border-white shadow-md overflow-hidden">
                                {champion.users?.avatar_url ? (
                                    <img src={champion.users.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-slate-400">
                                        {champion.users?.full_name?.charAt(0) || '?'}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 mt-2">
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                    {champion.users?.full_name || 'Anonymous Champion'}
                                </h1>

                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-medium text-slate-600 mb-4">
                                    <span className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200">
                                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        {champion.rating > 0 ? champion.rating : 'New Mentor'}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                                        <MessageSquare className="w-4 h-4" />
                                        {champion.total_sessions} Sessions
                                    </span>
                                    {champion.languages?.length > 0 && (
                                        <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                                            <Globe className="w-4 h-4" />
                                            {champion.languages.join(', ')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-3">About Me</h2>
                            <div className="prose prose-slate max-w-none text-slate-600 space-y-4 whitespace-pre-wrap">
                                {champion.bio || 'No biography provided yet. But I am ready to help!'}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Expertise & Specialisations</h2>
                            <div className="flex flex-wrap gap-2">
                                {champion.specialisations?.map((spec: string, i: number) => (
                                    <span key={i} className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold">
                                        {spec}
                                    </span>
                                ))}
                                {(!champion.specialisations || champion.specialisations.length === 0) && (
                                    <span className="text-slate-500 italic">General Mentorship</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking Widget */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24 overflow-hidden">
                        <div className="p-6 bg-slate-50 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" /> Book a Session
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Select a time to connect securely over 1-on-1 video with {champion.users?.full_name?.split(' ')[0] || 'this champion'}.
                            </p>
                        </div>

                        <div className="p-6">
                            <BookingForm championId={champion.id} />

                            <div className="mt-6 pt-6 border-t border-slate-100 flex items-start gap-3 text-xs text-slate-500">
                                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                <p>Sessions default to 30 minutes via the integrated secure Jitsi video room. No downloads required.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
