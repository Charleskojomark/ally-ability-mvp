import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

export const championsRouter: Router = Router();

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// GET /v1/champions
// Returns all available champions joined with their user name 
championsRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('champion_profiles')
            .select(`
        *,
        users!inner(full_name, avatar_url)
      `)
            .eq('is_available', true)
            .order('rating', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching champions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /v1/champions/:id
// Returns a single champion profile including user info
championsRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if UUID
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
            return res.status(400).json({ error: 'Invalid champion ID' });
        }

        const { data, error } = await supabase
            .from('champion_profiles')
            .select(`
        *,
        users!inner(full_name, avatar_url)
      `)
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Champion not found' });
            }
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching champion details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
