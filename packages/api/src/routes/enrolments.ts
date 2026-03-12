import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

export const enrolmentsRouter: Router = Router();

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// POST /v1/enrolments/
enrolmentsRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
        const { course_id } = req.body;
        const user_id = req.user?.id;

        if (!course_id || !user_id) {
            return res.status(400).json({ error: 'Missing course_id' });
        }

        // Check if already enrolled
        const { data: existing } = await supabase
            .from('enrolments')
            .select('id')
            .eq('user_id', user_id)
            .eq('course_id', course_id)
            .single();

        if (existing) {
            return res.status(200).json({ message: 'Already enrolled' });
        }

        const { error } = await supabase
            .from('enrolments')
            .insert({ user_id, course_id });

        if (error) throw error;

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

        const { data } = await supabase
            .from('enrolments')
            .select('id, completion_percentage')
            .eq('user_id', user_id)
            .eq('course_id', course_id)
            .single();

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

        // Upsert lesson progress
        const { error } = await supabase
            .from('lesson_progress')
            .upsert(
                {
                    user_id,
                    lesson_id,
                    watched_seconds,
                    completed,
                    accessibility_features_used: accessibility_features_used || '{}',
                    completed_at: completed ? new Date().toISOString() : null
                },
                { onConflict: 'user_id,lesson_id' }
            );

        if (error) throw error;

        res.json({ message: 'Progress updated' });
    } catch (error) {
        console.error('Progress error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
