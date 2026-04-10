import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { db, enrolments, lessonProgress } from '@ally-ability/database';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export const enrolmentsRouter: Router = Router();

// POST /v1/enrolments/
enrolmentsRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
        const { course_id } = req.body;
        const user_id = req.user?.id;

        if (!course_id || !user_id) {
            return res.status(400).json({ error: 'Missing course_id' });
        }

        const [existing] = await db
            .select()
            .from(enrolments)
            .where(and(eq(enrolments.user_id, user_id), eq(enrolments.course_id, course_id)))
            .limit(1);

        if (existing) {
            return res.status(200).json({ message: 'Already enrolled' });
        }

        await db.insert(enrolments).values({
            id: crypto.randomUUID(),
            user_id,
            course_id,
            enrolled_at: new Date()
        });

        res.status(201).json({ message: 'Successfully enrolled' });
    } catch (error) {
        console.error('Enrolment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /v1/enrolments/check/:course_id
enrolmentsRouter.get('/check/:course_id', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
        const { course_id } = req.params;
        const user_id = req.user?.id;
        if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

        const [data] = await db
            .select({ id: enrolments.id, completion_percentage: enrolments.completion_percentage })
            .from(enrolments)
            .where(and(eq(enrolments.user_id, user_id), eq(enrolments.course_id, course_id)))
            .limit(1);

        res.json({ isEnrolled: !!data, progress: data?.completion_percentage || 0 });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /v1/enrolments/progress
enrolmentsRouter.post('/progress', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
        const { lesson_id, watched_seconds, completed, accessibility_features_used } = req.body;
        const user_id = req.user?.id;

        if (!lesson_id || !user_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // SQLite Upsert using onConflictDoUpdate
        await db.insert(lessonProgress).values({
            id: crypto.randomUUID(),
            user_id,
            lesson_id,
            watched_seconds,
            completed,
            accessibility_features_used: JSON.stringify(accessibility_features_used || {}),
            completed_at: completed ? new Date() : null
        }).onConflictDoUpdate({
            target: [lessonProgress.user_id, lessonProgress.lesson_id],
            set: {
                watched_seconds,
                completed,
                accessibility_features_used: JSON.stringify(accessibility_features_used || {}),
                completed_at: completed ? new Date() : null
            }
        });

        res.json({ message: 'Progress updated' });
    } catch (error) {
        console.error('Progress error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
