import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import LessonPlayer from '@/components/LessonPlayer';

// Mock empty video fallback for development without R2 storage active yet
const DEMO_VIDEO_MOCK = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default async function LessonPage({ params }: { params: { id: string, lessonId: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let course: any = null;
    let enrolled = false;
    let errorMsg = '';

    try {
        // We fetch the course to get all lessons (in a real app, might just fetch the single lesson)
        course = await fetchApi(`/courses/${params.id}`, { cache: 'no-store' });
        const enrolStatus = await fetchApi(`/enrolments/check/${params.id}`, { cache: 'no-store' });
        enrolled = enrolStatus.isEnrolled;
    } catch (e: unknown) {
        if (e instanceof Error) errorMsg = e.message;
        else errorMsg = String(e);
    }

    if (errorMsg || !course || !enrolled) {
        return (
            <div className="max-w-4xl mx-auto p-8 mt-12 bg-red-50 border border-red-200 rounded-xl text-center">
                <h1 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h1>
                <p className="text-red-700">{errorMsg || "You must be enrolled in this course to view its lessons."}</p>
                <Link href={`/courses/${params.id}`} className="mt-6 inline-block text-blue-600 hover:underline">
                    &larr; Back to Course Detail
                </Link>
            </div>
        );
    }

    // Find the requested lesson among the modules
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let activeLesson: any = null;
    for (const mod of course.modules) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const found = mod.lessons?.find((l: any) => l.id === params.lessonId);
        if (found) {
            activeLesson = found;
            break;
        }
    }

    if (!activeLesson) {
        return <div className="p-8 text-center text-red-600 font-bold mt-12">Lesson not found.</div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">

            <div className="mb-6 flex items-center justify-between">
                <Link href={`/courses/${params.id}`} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    &larr; Back to {course.title}
                </Link>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded text-sm font-bold">
                    {course.accessibility_level} Level
                </div>
            </div>

            <LessonPlayer
                lessonId={activeLesson.id}
                title={activeLesson.title}
                description={activeLesson.description}
                videoUrl={activeLesson.video_url || DEMO_VIDEO_MOCK}
                nslVideoUrl={activeLesson.nsl_video_url || (course.has_nsl ? DEMO_VIDEO_MOCK : undefined)}
                transcript={activeLesson.transcript}
            />

        </div>
    );
}
