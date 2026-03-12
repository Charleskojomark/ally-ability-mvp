import AuthDebugger from '@/components/AuthDebugger';

export default function HomeDashboard() {
    return (
        <div className="w-full max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-6">Welcome to Your Dashboard</h1>
            <p className="text-lg mb-8">This is a protected route. Only authenticated users should see this.</p>

            <AuthDebugger />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border p-6 rounded-lg bg-card shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">My Courses</h2>
                    <p className="text-muted-foreground">Resume learning where you left off.</p>
                </div>

                <div className="border p-6 rounded-lg bg-card shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">Find a Champion</h2>
                    <p className="text-muted-foreground">Connect with mentors for 1-on-1 guidance.</p>
                </div>
            </div>
        </div>
    );
}
