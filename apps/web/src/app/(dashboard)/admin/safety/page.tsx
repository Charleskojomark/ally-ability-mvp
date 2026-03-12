import { fetchApi } from '@/lib/api';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { ShieldAlert, Download, CheckCircle, Clock, AlertTriangle, User } from 'lucide-react';
import ReportStatusDropdown from './ReportStatusDropdown';

export default async function AdminSafetyPage() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    // Role check to ensure only admin or moderator can access
    const role = session.user.user_metadata?.role;
    if (role !== 'admin' && role !== 'moderator') {
        redirect('/home');
    }

    // Fetch reports from our new protected endpoint
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let reports: any[] = [];
    try {
        reports = await fetchApi('/safety-reports');
    } catch (error) {
        console.error('Failed to fetch safety reports', error);
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'under_review': return <Clock className="w-4 h-4 text-amber-500" />;
            case 'escalated': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            default: return <Clock className="w-4 h-4 text-slate-400" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'resolved': return 'Resolved';
            case 'under_review': return 'Under Review';
            case 'escalated': return 'Escalated';
            default: return 'Submitted';
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <ShieldAlert className="text-red-500 w-8 h-8" /> Safety & Moderation Dashboard
                    </h1>
                    <p className="text-slate-600">
                        Review and manage Safe Space reports submitted by users.
                    </p>
                </div>
                <div>
                    <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                                <th className="px-6 py-4 font-medium">Date & ID</th>
                                <th className="px-6 py-4 font-medium">Reporter</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Description</th>
                                <th className="px-6 py-4 font-medium text-center">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No safety reports found.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 align-top">
                                            <div className="text-sm font-medium text-slate-900">
                                                {new Date(report.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono mt-1">
                                                {report.id.substring(0, 8)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            {report.is_anonymous ? (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-sm font-medium">
                                                    <span className="w-2 h-2 rounded-full bg-slate-400"></span> Anonymous
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                        {report.users?.full_name?.charAt(0) || <User className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">{report.users?.full_name || 'User'}</div>
                                                        <div className="text-xs text-slate-500">{report.users?.email || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-100">
                                                {report.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <p className="text-sm text-slate-600 line-clamp-2 max-w-md" title={report.description}>
                                                {report.description}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 align-top text-center">
                                            <div className="inline-flex items-center gap-1.5 justify-center">
                                                {getStatusIcon(report.status)}
                                                <span className="text-sm font-medium text-slate-700 capitalize">
                                                    {getStatusText(report.status)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top text-right">
                                            <ReportStatusDropdown reportId={report.id} currentStatus={report.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
