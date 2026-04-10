import { Router, Request, Response } from 'express';
import { db, championProfiles, users } from '@ally-ability/database';
import { eq, desc } from 'drizzle-orm';

export const championsRouter: Router = Router();

// GET /v1/champions
championsRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const result = await db.select({
            champion: championProfiles,
            user: { full_name: users.full_name, avatar_url: users.avatar_url }
        }).from(championProfiles)
            .innerJoin(users, eq(championProfiles.user_id, users.id))
            .where(eq(championProfiles.is_available, true))
            .orderBy(desc(championProfiles.rating));

        res.json(result.map(r => ({ ...r.champion, users: r.user })));
    } catch (error) {
        console.error('Error fetching champions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /v1/champions/:id
championsRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [result] = await db.select({
            champion: championProfiles,
            user: { full_name: users.full_name, avatar_url: users.avatar_url }
        }).from(championProfiles)
            .innerJoin(users, eq(championProfiles.user_id, users.id))
            .where(eq(championProfiles.id, id))
            .limit(1);

        if (!result) return res.status(404).json({ error: 'Champion not found' });

        res.json({ ...result.champion, users: result.user });
    } catch (error) {
        console.error('Error fetching champion details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
