import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { db, users } from '@ally-ability/database';
import { eq } from 'drizzle-orm';

export const usersRouter: Router = Router();

// GET /v1/users/preferences
usersRouter.get('/preferences', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
        const user_id = req.user?.id;

        if (!user_id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const [user] = await db.select({ accessibility_prefs: users.accessibility_prefs }).from(users).where(eq(users.id, user_id)).limit(1);

        // Default payload if preferences JSON is null in DB
        const prefs = user?.accessibility_prefs ? JSON.parse(user.accessibility_prefs) : {
            highContrast: false,
            dyslexicFont: false,
            textSize: 'normal',
        };

        res.json(prefs);
    } catch (error) {
        console.error('Error fetching preferences:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /v1/users/preferences
usersRouter.patch('/preferences', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
        const user_id = req.user?.id;
        const { preferences } = req.body;

        if (!user_id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await db.update(users).set({ accessibility_prefs: JSON.stringify(preferences) }).where(eq(users.id, user_id));

        res.json({ message: 'Preferences updated successfully', preferences });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
