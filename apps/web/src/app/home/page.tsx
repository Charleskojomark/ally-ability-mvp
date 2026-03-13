import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export default async function HomeDashboard() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const name = session?.user?.user_metadata?.full_name || 'Learner';

    const cards = [
        {
            title: 'My Courses',
            desc: 'Resume learning where you left off.',
            icon: '📚',
            href: '/courses',
            gradient: 'from-primary-50 to-primary-100/50',
            border: 'border-primary-200/60',
        },
        {
            title: 'Find a Champion',
            desc: 'Connect with mentors for 1-on-1 guidance.',
            icon: '🤝',
            href: '/champions',
            gradient: 'from-amber-50 to-orange-100/50',
            border: 'border-amber-200/60',
        },
        {
            title: 'Sessions',
            desc: 'View your upcoming mentoring sessions.',
            icon: '📅',
            href: '/sessions',
            gradient: 'from-sky-50 to-blue-100/50',
            border: 'border-sky-200/60',
        },
        {
            title: 'Safe Space',
            desc: 'Report concerns anonymously and securely.',
            icon: '🛡️',
            href: '#',
            gradient: 'from-green-50 to-emerald-100/50',
            border: 'border-green-200/60',
        },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-up">
            {/* Welcome */}
            <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
                    Welcome back, <span className="text-gradient">{name}</span>! 👋
                </h1>
                <p className="text-lg text-slate-500">
                    Here&apos;s your learning overview. Keep up the great work!
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                    { label: 'Enrolled Courses', value: '—', icon: '📖' },
                    { label: 'Completed', value: '—', icon: '✅' },
                    { label: 'Sessions', value: '—', icon: '🎯' },
                    { label: 'Streak', value: '—', icon: '🔥' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl mb-2">{stat.icon}</div>
                        <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                        <p className="text-sm text-slate-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cards.map((card, i) => (
                    <Link
                        key={i}
                        href={card.href}
                        className={'group relative p-7 rounded-2xl bg-gradient-to-br ' + card.gradient + ' border ' + card.border + ' hover:shadow-lg hover:-translate-y-1 transition-all duration-300'}
                    >
                        <div className="text-3xl mb-3">{card.icon}</div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-primary-700 transition-colors">
                            {card.title}
                        </h2>
                        <p className="text-slate-600">{card.desc}</p>
                        <div className="absolute top-7 right-7 text-slate-300 group-hover:text-primary-400 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
