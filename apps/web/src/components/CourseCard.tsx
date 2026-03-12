import Link from 'next/link';

interface CourseProps {
    course: {
        id: string;
        title: string;
        description: string;
        thumbnail_url: string;
        category: string;
        accessibility_level: 'basic' | 'standard' | 'gold';
        has_nsl: boolean;
        has_audio_description: boolean;
        has_captions: boolean;
        users?: {
            full_name: string;
        };
    };
}

export default function CourseCard({ course }: CourseProps) {
    // Map accessibility level to a visual color context
    const getAccessibilityColor = (level: string) => {
        switch (level) {
            case 'gold': return 'bg-amber-100 text-amber-800 border-amber-300';
            case 'standard': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'basic': return 'bg-gray-100 text-gray-800 border-gray-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <Link
            href={`/courses/${course.id}`}
            className="group flex flex-col bg-card rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden"
        >
            {/* Thumbnail Placeholder */}
            <div className="h-48 w-full bg-slate-200 relative overflow-hidden">
                {course.thumbnail_url ? (
                    <img
                        src={course.thumbnail_url}
                        alt={`Thumbnail for ${course.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
                        No Image
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                    {course.category}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                </h3>

                <p className="text-muted-foreground text-sm flex-grow line-clamp-3 mb-4">
                    {course.description}
                </p>

                <div className="text-xs text-slate-500 mb-4 font-medium">
                    Instructor: {course.users?.full_name || 'Unknown'}
                </div>

                {/* Accessibility Badges Area */}
                <div className="mt-auto pt-4 border-t flex flex-wrap gap-2 items-center">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ${getAccessibilityColor(course.accessibility_level)}`}>
                        {course.accessibility_level} Level
                    </span>

                    <div className="flex gap-1 ml-auto">
                        {course.has_nsl && (
                            <span className="bg-slate-100 text-slate-600 rounded px-1.5 py-1 text-xs font-semibold title" title="Nigerian Sign Language">
                                🤟 NSL
                            </span>
                        )}
                        {course.has_captions && (
                            <span className="bg-slate-100 text-slate-600 rounded px-1.5 py-1 text-xs font-semibold" title="Closed Captions">
                                CC
                            </span>
                        )}
                        {course.has_audio_description && (
                            <span className="bg-slate-100 text-slate-600 rounded px-1.5 py-1 text-xs font-semibold" title="Audio Description">
                                AD
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
