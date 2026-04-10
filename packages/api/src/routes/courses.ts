import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { db, courses, users, modules, lessons } from '@ally-ability/database';
import { eq, and, desc } from 'drizzle-orm';

export const coursesRouter: Router = Router();

// GET /v1/courses
coursesRouter.get('/', async (req, res) => {
    try {
        const { category, accessibility_level } = req.query;

        let conditions = [eq(courses.status, 'published')];
        if (category) conditions.push(eq(courses.category, category as string));
        if (accessibility_level) conditions.push(eq(courses.accessibility_level, accessibility_level as string));

        const result = await db
            .select({
                course: courses,
                author: { full_name: users.full_name, avatar_url: users.avatar_url }
            })
            .from(courses)
            .leftJoin(users, eq(courses.created_by, users.id))
            .where(and(...conditions))
            .orderBy(desc(courses.created_at));

        const mapped = result.map(r => ({
            ...r.course,
            users: r.author
        }));

        res.json(mapped);
    } catch (error) {
        console.error('Server error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /v1/courses/:id
coursesRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch course joined with user
        const courseData = await db
            .select({ course: courses, author: { full_name: users.full_name, avatar_url: users.avatar_url } })
            .from(courses)
            .leftJoin(users, eq(courses.created_by, users.id))
            .where(and(eq(courses.id, id), eq(courses.status, 'published')))
            .limit(1);

        if (courseData.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const course = {
            ...courseData[0].course,
            users: courseData[0].author,
            modules: [] as any[]
        };

        // Fetch modules for this course
        const mods = await db.select().from(modules).where(eq(modules.course_id, id)).orderBy(modules.order_index);

        // Fetch all lessons for these modules
        const moduleIds = mods.map(m => m.id);
        const less = moduleIds.length > 0 ? await Promise.all(
            moduleIds.map(modId => db.select().from(lessons).where(eq(lessons.module_id, modId)).orderBy(lessons.order_index))
        ) : [];

        course.modules = mods.map((mod, i) => ({
            ...mod,
            lessons: less[i] || []
        }));

        res.json(course);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
