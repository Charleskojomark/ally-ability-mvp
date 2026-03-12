'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, Calendar, FileText } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

export default function BookingForm({ championId }: { championId: string }) {
    const [scheduledAt, setScheduledAt] = useState('');
    const [duration, setDuration] = useState(30);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('You must be logged in to book a session.');

            const res = await fetch(`${API_BASE_URL}/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    champion_id: championId,
                    scheduled_at: new Date(scheduledAt).toISOString(),
                    duration_minutes: duration,
                    notes
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Booking failed');
            }

            setSuccess(true);
        } catch (err) {
            if (err instanceof Error) setErrorMsg(err.message);
            else setErrorMsg('An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="w-14 h-14 text-green-500 mb-4" />
                <h3 className="text-lg font-bold text-green-800 mb-2">Session Requested!</h3>
                <p className="text-sm text-green-700">
                    The Champion has been notified. You will receive an email with the Jitsi link once they confirm.
                </p>
            </div>
        );
    }

    // Minimum date: tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().slice(0, 16);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" /> Preferred Date & Time
                </label>
                <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={e => setScheduledAt(e.target.value)}
                    min={minDate}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Duration</label>
                <select
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" /> Notes (Optional)
                </label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    placeholder="What would you like help with?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                />
            </div>

            {errorMsg && (
                <div className="text-red-600 text-sm font-bold p-3 bg-red-50 rounded-lg border border-red-100">
                    {errorMsg}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-lg font-bold text-white transition-colors ${loading ? 'bg-primary/60 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20'
                    }`}
            >
                {loading ? 'Sending Request...' : 'Request Session'}
            </button>
        </form>
    );
}
