'use server'

import { fetchApi } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function enrolInCourse(courseId: string) {
    try {
        await fetchApi('/enrolments', {
            method: 'POST',
            body: JSON.stringify({ course_id: courseId }),
        });

        // Invalidate the course details page cache to reflect the enrolment status immediately
        revalidatePath(`/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        let message = 'An unknown error occurred';
        if (error instanceof Error) message = error.message;
        console.error('EnrolAction Error:', message);
        return { success: false, error: message };
    }
}
