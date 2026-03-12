'use client';

import { useState, useEffect } from 'react';
import { Activity, Zap, Clock, Building2 } from 'lucide-react';

interface Partner {
    id: string;
    organisation_name: string;
    tier: string;
    is_active: boolean;
}

interface AnalyticsData {
    events: Array<{ event_type: string; recorded_at: string }>;
    summary: Record<string, number>;
    total: number;
}

const EVENT_COLORS: Record<string, string> = {
    widget_loaded: '#6366f1',
    widget_opened: '#8b5cf6',
    toggle_contrast: '#f59e0b',
    toggle_dyslexia: '#10b981',
    toggle_text_large: '#3b82f6',
    toggle_text_xlarge: '#06b6d4',
};

export default function AnalyticsViewer({ partners }: { partners: Partner[] }) {
    const [selectedPartner, setSelectedPartner] = useState(partners[0]?.id || '');
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedPartner) return;

        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';
        fetch(apiUrl + '/widget/analytics/' + selectedPartner)
            .then((res) => res.json())
            .then((data) => setAnalytics(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [selectedPartner]);

    const maxCount = analytics
        ? Math.max(...Object.values(analytics.summary), 1)
        : 1;

    return (
        <div className="space-y-6">
            {/* Partner Selector */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" /> Select Partner
                </label>
                <select
                    value={selectedPartner}
                    onChange={(e) => setSelectedPartner(e.target.value)}
                    className="w-full md:w-80 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                    {partners.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.organisation_name} ({p.tier})
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-slate-500">Loading analytics...</p>
                </div>
            )}

            {!loading && analytics && (
                <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-indigo-600" />
                                </div>
                                <span className="text-sm font-medium text-slate-500">Total Events</span>
                            </div>
                            <p className="text-3xl font-bold text-slate-900">{analytics.total}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-purple-600" />
                                </div>
                                <span className="text-sm font-medium text-slate-500">Event Types</span>
                            </div>
                            <p className="text-3xl font-bold text-slate-900">
                                {Object.keys(analytics.summary).length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-slate-500">Latest Event</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                                {analytics.events.length > 0
                                    ? new Date(analytics.events[0].recorded_at).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Usage Breakdown</h3>
                        {Object.keys(analytics.summary).length === 0 ? (
                            <p className="text-slate-500 text-center py-8">No events recorded yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(analytics.summary)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([eventType, count]) => {
                                        const pct = Math.round((count / maxCount) * 100);
                                        const color = EVENT_COLORS[eventType] || '#64748b';
                                        return (
                                            <div key={eventType}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {eventType.replace(/_/g, ' ')}
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-900">{count}</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{
                                                            width: pct + '%',
                                                            backgroundColor: color,
                                                            minWidth: '8px',
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>

                    {/* Recent Events Timeline */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Events</h3>
                        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                            {analytics.events.slice(0, 20).map((evt, i) => (
                                <div key={i} className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full shrink-0"
                                            style={{
                                                backgroundColor:
                                                    EVENT_COLORS[evt.event_type] || '#64748b',
                                            }}
                                        ></div>
                                        <span className="text-sm font-medium text-slate-700">
                                            {evt.event_type.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        {new Date(evt.recorded_at).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            {analytics.events.length === 0 && (
                                <p className="text-slate-500 text-center py-4">No events yet.</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
