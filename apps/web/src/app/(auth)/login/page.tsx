import Link from 'next/link';
import { login } from './actions';

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
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
                        <h1 className="text-2xl font-extrabold text-slate-900">Welcome Back</h1>
                        <p className="text-slate-500 mt-1">Sign in to continue learning</p>
                    </div>

                    <form action={login} className="space-y-5">
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
                                id="login-email"
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
                                placeholder="Enter your password"
                                required
                                aria-label="Password"
                                id="login-password"
                            />
                        </div>

                        <button
                            className="w-full gradient-primary text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                            id="login-submit"
                        >
                            Sign In
                        </button>

                        {searchParams?.message && (
                            <div className="p-4 bg-red-50 text-red-700 text-center rounded-xl text-sm font-medium border border-red-100">
                                {searchParams.message}
                            </div>
                        )}
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-slate-500 text-sm">Don&apos;t have an account? </span>
                        <Link href="/register" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
