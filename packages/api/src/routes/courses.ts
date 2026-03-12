import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

export const coursesRouter: Router = Router();

// Initialize backend Supabase client (using service role for raw DB access, though RLS applies if user context passed)
const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
);

// GET /v1/courses
coursesRouter.get('/', async (req, res) => {
    try {
        const { category, accessibility_level } = req.query;

        let query = supabase
            .from('courses')
            .select('*, users!courses_created_by_fkey(full_name, avatar_url)')
            .eq('status', 'published');

        if (category) {
            query = query.eq('category', category);
        }

        if (accessibility_level) {
            query = query.eq('accessibility_level', accessibility_level);
        }

        // Order by newest first
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
            console.error('Database error fetching courses:', error);
            return res.status(500).json({ error: 'Failed to fetch courses' });
        }

        res.json(data);
    } catch (error) {
        console.error('Server error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /v1/courses/:id
coursesRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch course with its modules and lessons
        const { data: course, error } = await supabase
            .from('courses')
            .select(`
        *,
        users!courses_created_by_fkey(full_name, avatar_url),
        modules (
          *,
          lessons (*)
        )
      `)
            .eq('id', id)
            .eq('status', 'published')
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Course not found' });
            }
            return res.status(500).json({ error: 'Failed to fetch course details' });
        }

        // Sort modules and lessons by order_index manually if needed
        if (course && course.modules) {
            course.modules.sort((a: any, b: any) => a.order_index - b.order_index);
            course.modules.forEach((module: any) => {
                if (module.lessons) {
                    module.lessons.sort((a: any, b: any) => a.order_index - b.order_index);
                }
            });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
