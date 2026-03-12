'use client';

import { useState } from 'react';
import { enrolInCourse } from '../app/courses/[id]/actions';

export default function EnrolButton({ courseId, isEnrolled }: { courseId: string; isEnrolled: boolean }) {
    const [loading, setLoading] = useState(false);

    const handleEnrol = async () => {
        setLoading(true);
        try {
            const res = await enrolInCourse(courseId);
            if (!res.success) {
                alert(res.error || 'Must be logged in to enrol.');
            }
        } catch (error) {
            console.error('Failed to enrol:', error);
            alert('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (isEnrolled) {
        return (
            <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-bold text-center inline-block shadow-sm">
                ✓ Enrolled in Course
            </div>
        );
    }

    return (
        <button
            onClick={handleEnrol}
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-bold text-white transition-all shadow-md ${loading ? 'bg-primary/50 cursor-not-allowed scale-95' : 'bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95'
                }`}
        >
            {loading ? 'Enrolling...' : 'Enrol Now'}
        </button>
    );
}
