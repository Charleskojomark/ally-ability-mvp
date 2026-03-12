import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl mb-6">
        The Ally-Ability Network
      </h1>
      <p className="text-xl text-muted-foreground max-w-[800px] mb-12">
        An inclusive e-learning platform empowering women, persons with disabilities, and teachers in Nigeria with digital skills, safe spaces, and remote work opportunities.
      </p>

      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-3 rounded-md bg-white border border-gray-300 text-black font-semibold hover:bg-gray-100 transition-colors">
          Sign In
        </Link>
        <Link href="/register" className="px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
          Create Account
        </Link>
      </div>

      <div className="mt-16 text-sm text-gray-500">
        <p>Phase 3 - Foundational Next.js App Route Setup</p>
      </div>
    </main>
  );
}
