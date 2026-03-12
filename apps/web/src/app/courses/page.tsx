import { fetchApi } from '@/lib/api';
import CourseCard from '@/components/CourseCard';
import Link from 'next/link';

// Simple types matching our DB return payload
type Course = {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    category: string;
    accessibility_level: 'basic' | 'standard' | 'gold';
    has_nsl: boolean;
    has_audio_description: boolean;
    has_captions: boolean;
    users?: { full_name: string };
};

export default async function CoursesCatalogue({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const category = typeof searchParams.category === 'string' ? searchParams.category : '';
    const accessibility_level = typeof searchParams.accessibility_level === 'string' ? searchParams.accessibility_level : '';

    // Build query string cleanly
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (accessibility_level) params.append('accessibility_level', accessibility_level);

    const queryString = params.toString() ? `?${params.toString()}` : '';

    let courses: Course[] = [];
    let errorMsg = '';

    try {
        courses = await fetchApi(`/courses${queryString}`, { cache: 'no-store' });
    } catch (e) {
        if (e instanceof Error) {
            errorMsg = e.message;
        } else {
            errorMsg = String(e);
        }
    }

    // Define static filter options based on our typical seed data / schema
    const categories = ['All', 'Business', 'Technology', 'Design', 'Soft Skills'];
    const accessLevels = ['All', 'gold', 'standard', 'basic'];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">

            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
                <div>
                    <h2 className="text-xl font-bold mb-4">Filters</h2>
                    <hr className="mb-4" />

                    {/* Categories */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Categories</h3>
                        <ul className="flex flex-col gap-2">
                            {categories.map((c) => {
                                const isActive = (c === 'All' && !category) || (c.toLowerCase() === category.toLowerCase());
                                const href = c === 'All'
                                    ? `/courses${accessibility_level ? `?accessibility_level=${accessibility_level}` : ''}`
                                    : `/courses?category=${c}${accessibility_level ? `&accessibility_level=${accessibility_level}` : ''}`;

                                return (
                                    <li key={c}>
                                        <Link
                                            href={href}
                                            className={`block py-1 px-2 rounded-md text-sm transition-colors ${isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted text-foreground'}`}
                                        >
                                            {c}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Accessibility Level */}
                    <div>
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Accessibility Level</h3>
                        <ul className="flex flex-col gap-2">
                            {accessLevels.map((l) => {
                                const isActive = (l === 'All' && !accessibility_level) || l === accessibility_level;
                                const href = l === 'All'
                                    ? `/courses${category ? `?category=${category}` : ''}`
                                    : `/courses?accessibility_level=${l}${category ? `&category=${category}` : ''}`;

                                return (
                                    <li key={l}>
                                        <Link
                                            href={href}
                                            className={`block py-1 px-2 rounded-md text-sm transition-colors capitalize ${isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted text-foreground'}`}
                                        >
                                            {l} Level
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold mb-2">Course Catalogue</h1>
                        <p className="text-muted-foreground">Find accessible learning content tailored to your needs.</p>
                    </div>
                </div>

                {errorMsg ? (
                    <div className="p-4 bg-red-50 text-red-900 border border-red-200 rounded-lg">
                        Failed to load courses: {errorMsg}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="p-12 text-center border rounded-lg bg-card border-dashed">
                        <h3 className="text-lg font-bold mb-2">No courses found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters to find more options.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
