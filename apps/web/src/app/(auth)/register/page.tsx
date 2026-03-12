import Link from 'next/link';
import { register } from './actions';

export default function RegisterPage({ searchParams }: { searchParams: { message: string } }) {
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
                    action={register}
                >
                    <h1 className="text-3xl font-bold mb-6">Create Account</h1>

                    <label className="text-md font-semibold" htmlFor="full_name">
                        Full Name
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-4 text-black bg-white"
                        name="full_name"
                        placeholder="John Doe"
                        required
                        aria-label="Full Name"
                    />

                    <label className="text-md font-semibold" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-4 text-black bg-white"
                        name="email"
                        placeholder="you@example.com"
                        required
                        aria-label="Email address"
                        type="email"
                    />

                    <label className="text-md font-semibold" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-4 text-black bg-white"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        aria-label="Password"
                    />

                    <label className="text-md font-semibold mt-2" htmlFor="role">
                        I want to join as a:
                    </label>
                    <select name="role" required className="rounded-md px-4 py-2 bg-inherit border mb-4 text-black bg-white">
                        <option value="learner">Learner (Take courses)</option>
                        <option value="teacher">Teacher (Create courses)</option>
                        <option value="champion">Champion (Mentor others)</option>
                        <option value="partner">Partner (Ally-Engine API)</option>
                    </select>

                    <label className="text-md font-semibold mt-2" htmlFor="disability_type">
                        Do you identify with any of the following?
                    </label>
                    <select name="disability_type" required className="rounded-md px-4 py-2 bg-inherit border mb-6 text-black bg-white">
                        <option value="none">None</option>
                        <option value="visual">Visual Impairment / Blindness</option>
                        <option value="hearing">Hearing Impairment / Deafness</option>
                        <option value="cognitive">Cognitive / Learning Disability (e.g. Dyslexia)</option>
                        <option value="physical">Physical / Motor Disability</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>

                    <button className="bg-primary hover:bg-opacity-90 text-white rounded-md px-4 py-2 text-foreground mb-4 font-bold">
                        Sign Up
                    </button>

                    {searchParams?.message && (
                        <p className="mt-4 p-4 bg-muted text-foreground text-center rounded-md text-sm font-medium">
                            {searchParams.message}
                        </p>
                    )}

                    <div className="text-center mt-4">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link href="/login" className="font-bold underline text-primary">
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
