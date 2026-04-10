import { Router, Request, Response } from 'express';
import { db, apiPartners, widgetEvents } from '@ally-ability/database';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

export const widgetRouter: Router = Router();

// GET /v1/widget/partners
widgetRouter.get('/partners', async (_req: Request, res: Response) => {
    try {
        const data = await db
            .select({ id: apiPartners.id, organisation_name: apiPartners.organisation_name, tier: apiPartners.tier, is_active: apiPartners.is_active, created_at: apiPartners.created_at })
            .from(apiPartners)
            .orderBy(desc(apiPartners.created_at));

        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /v1/widget/validate?api_key=...
widgetRouter.get('/validate', async (req: Request, res: Response) => {
    try {
        const apiKey = req.query.api_key as string;
        if (!apiKey) return res.status(400).json({ valid: false, error: 'api_key is required' });

        const [data] = await db
            .select()
            .from(apiPartners)
            .where(eq(apiPartners.api_key, apiKey))
            .limit(1);

        if (!data) return res.status(404).json({ valid: false, error: 'Invalid API key' });
        if (!data.is_active) return res.status(403).json({ valid: false, error: 'Partner account is inactive' });

        res.setHeader('Access-Control-Allow-Origin', '*');

        return res.json({
            valid: true,
            partner_id: data.id,
            organisation: data.organisation_name,
            tier: data.tier,
            features: typeof data.features_enabled === 'string' ? JSON.parse(data.features_enabled) : data.features_enabled
        });
    } catch (error) {
        res.status(500).json({ valid: false, error: 'Internal server error' });
    }
});

// POST /v1/widget/event
widgetRouter.post('/event', async (req: Request, res: Response) => {
    try {
        const { partner_id, event_type, session_id } = req.body;
        if (!partner_id || !event_type) return res.status(400).json({ error: 'partner_id and event_type are required' });

        res.setHeader('Access-Control-Allow-Origin', '*');

        await db.insert(widgetEvents).values({
            id: crypto.randomUUID(),
            partner_id,
            event_type,
            session_id,
            recorded_at: new Date()
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /v1/widget/analytics/:partner_id
widgetRouter.get('/analytics/:partner_id', async (req: Request, res: Response) => {
    try {
        const { partner_id } = req.params;

        const data = await db
            .select({ event_type: widgetEvents.event_type, recorded_at: widgetEvents.recorded_at })
            .from(widgetEvents)
            .where(eq(widgetEvents.partner_id, partner_id))
            .orderBy(desc(widgetEvents.recorded_at))
            .limit(500);

        const counts: Record<string, number> = {};
        data.forEach(evt => {
            counts[evt.event_type] = (counts[evt.event_type] || 0) + 1;
        });

        res.json({ events: data, summary: counts, total: data.length });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
