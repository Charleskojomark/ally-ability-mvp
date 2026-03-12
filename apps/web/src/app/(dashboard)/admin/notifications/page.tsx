'use client';

import { useState } from 'react';
import { MessageSquare, Send, CheckCircle, AlertCircle, Loader2, Users } from 'lucide-react';

export default function AdminNotificationsPage() {
    const [recipientType, setRecipientType] = useState<'single' | 'bulk'>('single');
    const [phone, setPhone] = useState('');
    const [phoneList, setPhoneList] = useState('');
    const [message, setMessage] = useState(
        'Hello! 🌟 Just a friendly reminder from The Ally-Ability Network: Your next lesson is ready! Keep up the great progress. 🚀'
    );
    const [sending, setSending] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError('');
        setResult(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

            if (recipientType === 'single') {
                if (!phone.trim()) throw new Error('Phone number is required');

                const res = await fetch(apiUrl + '/notifications/whatsapp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: phone.trim(), message }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to send');

                setResult({
                    type: 'single',
                    success: true,
                    message: 'Message delivered to ' + phone,
                });
                setPhone('');
            } else {
                const phones = phoneList
                    .split('\n')
                    .map((p) => p.trim())
                    .filter(Boolean);

                if (phones.length === 0) throw new Error('At least one phone number is required');

                const res = await fetch(apiUrl + '/notifications/whatsapp/bulk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phones, message }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to send bulk');

                setResult({
                    type: 'bulk',
                    success: true,
                    message: 'Delivered ' + data.sent + ' out of ' + data.total + ' messages.',
                    details: data.results,
                });
                setPhoneList('');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="text-green-500 w-8 h-8" /> WhatsApp Notifications
                </h1>
                <p className="text-slate-600">
                    Send lesson reminders directly to learners&apos; WhatsApp accounts. Note: The backend server must be authenticated via QR code in the terminal.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <form onSubmit={handleSend} className="space-y-6">
                    {/* Recipient Type Toggle */}
                    <div className="flex p-1 bg-slate-100 rounded-lg max-w-sm">
                        <button
                            type="button"
                            onClick={() => setRecipientType('single')}
                            className={
                                'flex-1 py-2 text-sm font-medium rounded-md transition-all ' +
                                (recipientType === 'single'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700')
                            }
                        >
                            <User className="w-4 h-4 inline mr-1 -mt-0.5" /> Single Learner
                        </button>
                        <button
                            type="button"
                            onClick={() => setRecipientType('bulk')}
                            className={
                                'flex-1 py-2 text-sm font-medium rounded-md transition-all ' +
                                (recipientType === 'bulk'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700')
                            }
                        >
                            <Users className="w-4 h-4 inline mr-1 -mt-0.5" /> Bulk Send
                        </button>
                    </div>

                    {/* Recipient Inputs */}
                    {recipientType === 'single' ? (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Phone Number (Include Country Code)
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. +2348012345678"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Phone Numbers (One per line)
                            </label>
                            <textarea
                                value={phoneList}
                                onChange={(e) => setPhoneList(e.target.value)}
                                placeholder="+2348012345678\n+2348087654321"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all min-h-[120px]"
                                required
                            />
                        </div>
                    )}

                    {/* Message Input */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Message Content
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all min-h-[150px]"
                            required
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Standard WhatsApp text formatting applies (e.g., *bold*, _italic_).
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        className="w-full bg-green-500 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {sending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Send WhatsApp Message
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                        <p className="text-red-800 font-medium">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-bold text-green-800">{result.message}</span>
                        </div>
                        {result.type === 'bulk' && result.details && (
                            <div className="mt-4 max-h-40 overflow-y-auto bg-white rounded-lg p-3 border border-green-200">
                                {result.details.map((d: { phone: string; success: boolean }, i: number) => (
                                    <div key={i} className="flex justify-between text-sm py-1 border-b border-slate-50 last:border-0">
                                        <span className="font-mono">{d.phone}</span>
                                        {d.success ? (
                                            <span className="text-green-600 font-medium">Sent</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">Failed</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function User(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
