import Link from 'next/link';
import { login } from './actions';

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <div className="w-full flex-1 flex flex-col justify-center gap-6">
                <Link
                    href="/"
                    className="left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>{' '}
                    Back
                </Link>

                <form
                    className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
                    action={login}
                >
                    <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>

                    <label className="text-md" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6 text-black bg-white"
                        name="email"
                        placeholder="you@example.com"
                        required
                        aria-label="Email address"
                        type="email"
                    />
                    <label className="text-md" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6 text-black bg-white"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        aria-label="Password"
                    />
                    <button className="bg-primary hover:bg-opacity-90 text-white rounded-md px-4 py-2 text-foreground mb-4">
                        Sign In
                    </button>

                    {searchParams?.message && (
                        <p className="mt-4 p-4 bg-red-100 text-red-900 text-center rounded-md font-medium text-sm">
                            {searchParams.message}
                        </p>
                    )}

                    <div className="text-center mt-4">
                        <span className="text-gray-600">Don&apos;t have an account? </span>
                        <Link href="/register" className="font-bold underline text-primary">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
