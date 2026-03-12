'use client';

import { useState } from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

interface SafeSpaceFormProps {
    onCompletion?: () => void;
}

export default function SafeSpaceForm({ onCompletion }: SafeSpaceFormProps) {
    const [category, setCategory] = useState('Accessibility Issue');
    const [description, setDescription] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const payload = {
                category,
                description,
                is_anonymous: isAnonymous
            };

            // Get session for auth if they are logged in and not anonymous
            const { data: { session } } = await supabase.auth.getSession();

            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };

            if (session && !isAnonymous) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            await fetch(`${API_BASE_URL}/safety-reports`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            setSuccess(true);
            if (onCompletion) {
                setTimeout(onCompletion, 3000);
            }
        } catch (e: unknown) {
            if (e instanceof Error) setErrorMsg(e.message);
            else setErrorMsg(String(e));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-green-50 rounded-xl border border-green-100">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Report Submitted</h3>
                <p className="text-sm border-green-700 font-medium">
                    Thank you for speaking up. The moderation team has been notified.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-red-700 flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-6 w-6" /> Safe Space Report
                </h2>
                <p className="text-muted-foreground text-sm">
                    Use this form to securely report harassment, critical accessibility barriers, or technical issues natively.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                    <label className="block text-sm font-semibold mb-1 text-slate-800">Issue Category</label>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        required
                    >
                        <option value="Accessibility Issue">Accessibility Issue</option>
                        <option value="Harassment / Toxicity">Harassment / Toxicity</option>
                        <option value="Technical Bug">Technical Bug</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1 text-slate-800">Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Please describe what happened or what you experienced..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                        required
                    />
                </div>

                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex gap-3">
                    <input
                        type="checkbox"
                        id="anonymous"
                        className="mt-1 shrink-0 accent-blue-600"
                        checked={isAnonymous}
                        onChange={e => setIsAnonymous(e.target.checked)}
                    />
                    <div>
                        <label htmlFor="anonymous" className="text-sm font-bold text-blue-900 block mb-1 cursor-pointer">
                            Submit Anonymously
                        </label>
                        <p className="text-xs text-blue-800 flex items-start gap-1">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            Your identity will be completely hidden from the moderation team. We will not be able to follow up with you directly.
                        </p>
                    </div>
                </div>

                {errorMsg && (
                    <div className="text-red-600 text-sm font-bold p-3 bg-red-50 rounded border border-red-100">
                        {errorMsg}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 rounded-lg border font-bold text-white transition-colors mt-2 ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow shadow-red-200'
                        }`}
                >
                    {loading ? 'Submitting...' : 'Submit Report Securly'}
                </button>
            </form>
        </div>
    );
}
