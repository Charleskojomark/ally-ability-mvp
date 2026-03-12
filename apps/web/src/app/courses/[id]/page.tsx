import { fetchApi } from '@/lib/api';
import EnrolButton from '@/components/EnrolButton';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let course: any = null;
    let enrolmentStatus = { isEnrolled: false, progress: 0 };
    let errorMsg = '';

    try {
        // 1. Fetch full course details including modules/lessons
        course = await fetchApi(`/courses/${params.id}`);

        // 2. Check if the user is enrolled (if authenticated)
        if (session) {
            enrolmentStatus = await fetchApi(`/enrolments/check/${params.id}`);
        }
    } catch (e: unknown) {
        if (e instanceof Error) {
            errorMsg = e.message;
        } else {
            errorMsg = String(e);
        }
    }

    if (errorMsg || !course) {
        return (
            <div className="max-w-4xl mx-auto p-8 mt-12 bg-red-50 border border-red-200 rounded-xl text-center">
                <h1 className="text-2xl font-bold text-red-800 mb-2">Error Loading Course</h1>
                <p className="text-red-700">{errorMsg || 'Course not found'}</p>
                <Link href="/courses" className="mt-6 inline-block text-blue-600 hover:underline">
                    &larr; Back to Catalogue
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12">

            {/* Course Header Banner */}
            <header className="bg-card rounded-2xl border shadow-sm overflow-hidden mb-12">
                <div className="h-48 md:h-64 bg-slate-200 w-full relative">
                    {course.thumbnail_url ? (
                        <img src={course.thumbnail_url} className="w-full h-full object-cover" alt="" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            No Cover Image
                        </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-sm font-bold px-3 py-1.5 rounded-md text-slate-800">
                        {course.category}
                    </div>
                </div>

                <div className="p-6 md:p-10">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{course.title}</h1>
                    <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
                        {course.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-t border-slate-100 pt-8">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Accessibility Context</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm outline outline-1 outline-primary/30">
                                    {course.accessibility_level} Level
                                </span>
                                {course.has_nsl && <span className="bg-slate-100 text-slate-700 px-2 py-1 flex items-center gap-1 rounded text-sm font-medium">🤟 Sign Language (NSL)</span>}
                                {course.has_captions && <span className="bg-slate-100 text-slate-700 px-2 py-1 flex items-center gap-1 rounded text-sm font-medium">💬 Closed Captions</span>}
                                {course.has_audio_description && <span className="bg-slate-100 text-slate-700 px-2 py-1 flex items-center gap-1 rounded text-sm font-medium">🎧 Audio Description</span>}
                            </div>
                        </div>

                        <div className="shrink-0 mt-4 sm:mt-0">
                            <EnrolButton courseId={course.id} isEnrolled={enrolmentStatus.isEnrolled} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Course Curriculum / Modules */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    Course Curriculum
                </h2>

                {!enrolmentStatus.isEnrolled && (
                    <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl mb-8 flex gap-3 text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                        You must enrol in this course to access the lesson player and materials.
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {course.modules?.map((module: any, mIndex: number) => (
                        <div key={module.id} className="border rounded-xl bg-card overflow-hidden shadow-sm">
                            <div className="p-4 md:p-6 bg-slate-50 border-b flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">Module {mIndex + 1}: {module.title}</h3>
                                    {module.description && <p className="text-sm text-slate-500 mt-1">{module.description}</p>}
                                </div>
                                <div className="text-sm font-semibold text-slate-400">
                                    {module.lessons?.length || 0} Lessons
                                </div>
                            </div>

                            <ul className="divide-y divide-slate-100">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {module.lessons?.map((lesson: any, lIndex: number) => (
                                    <li key={lesson.id} className="group hover:bg-slate-50 transition-colors">
                                        {enrolmentStatus.isEnrolled ? (
                                            <Link
                                                href={`/courses/${course.id}/lessons/${lesson.id}`}
                                                className="flex items-center justify-between p-4 md:px-6"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                                        {lIndex + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-slate-900 group-hover:text-primary transition-colors">{lesson.title}</h4>
                                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{lesson.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Play &rarr;
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="flex items-center justify-between p-4 md:px-6 opacity-60 cursor-not-allowed">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0">
                                                        {lIndex + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-slate-700 line-through">{lesson.title}</h4>
                                                    </div>
                                                </div>
                                                <div className="text-slate-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
