import Link from 'next/link';
import { register } from './actions';

export default function RegisterPage({ searchParams }: { searchParams: { message: string } }) {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-fade-up">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 border border-slate-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-white font-extrabold text-xl">A</span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900">Create Account</h1>
                        <p className="text-slate-500 mt-1">Join the inclusive learning community</p>
                    </div>

                    <form action={register} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="full_name">
                                Full Name
                            </label>
                            <input
                                className="w-full rounded-xl px-4 py-3 border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                name="full_name"
                                placeholder="Your full name"
                                required
                                aria-label="Full Name"
                                id="register-name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                className="w-full rounded-xl px-4 py-3 border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                name="email"
                                placeholder="you@example.com"
                                required
                                aria-label="Email address"
                                type="email"
                                id="register-email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="w-full rounded-xl px-4 py-3 border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                type="password"
                                name="password"
                                placeholder="Create a strong password"
                                required
                                aria-label="Password"
                                id="register-password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="role">
                                I want to join as
                            </label>
                            <select
                                name="role"
                                required
                                className="w-full rounded-xl px-4 py-3 border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                                id="register-role"
                            >
                                <option value="learner">Learner (Take courses)</option>
                                <option value="teacher">Teacher (Create courses)</option>
                                <option value="champion">Champion (Mentor others)</option>
                                <option value="partner">Partner (Ally-Engine API)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="disability_type">
                                Do you identify with any of the following?
                            </label>
                            <select
                                name="disability_type"
                                required
                                className="w-full rounded-xl px-4 py-3 border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                                id="register-disability"
                            >
                                <option value="none">None</option>
                                <option value="visual">Visual Impairment / Blindness</option>
                                <option value="hearing">Hearing Impairment / Deafness</option>
                                <option value="cognitive">Cognitive / Learning Disability</option>
                                <option value="physical">Physical / Motor Disability</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                        </div>

                        <button
                            className="w-full gradient-primary text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-2"
                            id="register-submit"
                        >
                            Create Account
                        </button>

                        {searchParams?.message && (
                            <div className="p-4 bg-amber-50 text-amber-800 text-center rounded-xl text-sm font-medium border border-amber-100">
                                {searchParams.message}
                            </div>
                        )}
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-slate-500 text-sm">Already have an account? </span>
                        <Link href="/login" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
