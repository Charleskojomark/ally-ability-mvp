import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

export const usersRouter: Router = Router();

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// GET /v1/users/preferences
usersRouter.get('/preferences', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
        const user_id = req.user?.id;

        if (!user_id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data, error } = await supabase
            .from('users')
            .select('preferences')
            .eq('id', user_id)
            .single();

        if (error) throw error;

        // Default payload if preferences JSON is null in DB
        const prefs = data?.preferences || {
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

        // Upsert or merge into the JSONB column
        const { error } = await supabase
            .from('users')
            .update({ preferences })
            .eq('id', user_id);

        if (error) throw error;

        res.json({ message: 'Preferences updated successfully', preferences });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
