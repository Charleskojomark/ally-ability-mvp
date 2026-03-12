import { fetchApi } from '@/lib/api';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Video, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <AlertCircle className="w-4 h-4" /> },
    confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle2 className="w-4 h-4" /> },
    completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <CheckCircle2 className="w-4 h-4" /> },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="w-4 h-4" /> },
};

export default async function SessionsPage() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sessions: any[] = [];
    try {
        const result = await fetchApi('/sessions');
        sessions = result?.sessions || [];
    } catch (error) {
        console.error('Failed to fetch sessions:', error);
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Calendar className="text-primary w-8 h-8" /> My Sessions
                </h1>
                <p className="text-slate-600">
                    View and manage your mentorship sessions with Champions.
                </p>
            </div>

            {sessions.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
                    <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-700 mb-2">No sessions yet</h2>
                    <p className="text-slate-500 mb-6">Book your first 1-on-1 mentorship session with a Champion!</p>
                    <Link href="/champions" className="bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 inline-block">
                        Browse Champions
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {sessions.map((s) => {
                        const status = statusConfig[s.status] || statusConfig.pending;
                        const scheduledDate = new Date(s.scheduled_at);
                        const isPast = scheduledDate < new Date();
                        const isJoinable = s.status === 'confirmed' && !isPast;

                        return (
                            <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${status.color}`}>
                                                {status.icon} {status.label}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {s.duration_minutes || 30} min
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-lg text-slate-800 mb-1">
                                            Session with {s.champion?.full_name || s.teacher?.full_name || 'Champion'}
                                        </h3>

                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {scheduledDate.toLocaleDateString('en-NG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {scheduledDate.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {s.notes && (
                                            <p className="text-sm text-slate-500 mt-2 italic">&quot;{s.notes}&quot;</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {isJoinable && s.jitsi_room_name && (
                                            <a
                                                href={`https://meet.jit.si/${s.jitsi_room_name}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-green-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-600/20"
                                            >
                                                <Video className="w-5 h-5" /> Join Meeting
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
