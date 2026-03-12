import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

export const widgetRouter: Router = Router();

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// GET /v1/widget/partners
// Lists all registered API partners (admin use)
widgetRouter.get('/partners', async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('api_partners')
            .select('id, organisation_name, tier, is_active, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        console.error('Widget Partners Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /v1/widget/validate?api_key=...
// Validates a partner's API key and returns their enabled features
widgetRouter.get('/validate', async (req: Request, res: Response) => {
    try {
        const apiKey = req.query.api_key as string;
        if (!apiKey) {
            return res.status(400).json({ valid: false, error: 'api_key is required' });
        }

        const { data, error } = await supabase
            .from('api_partners')
            .select('id, organisation_name, tier, features_enabled, is_active')
            .eq('api_key', apiKey)
            .single();

        if (error || !data) {
            return res.status(404).json({ valid: false, error: 'Invalid API key' });
        }

        if (!data.is_active) {
            return res.status(403).json({ valid: false, error: 'Partner account is inactive' });
        }

        // Set CORS headers to allow widget usage from any origin
        res.setHeader('Access-Control-Allow-Origin', '*');

        return res.json({
            valid: true,
            partner_id: data.id,
            organisation: data.organisation_name,
            tier: data.tier,
            features: data.features_enabled
        });
    } catch (error) {
        console.error('Widget Validate Error:', error);
        res.status(500).json({ valid: false, error: 'Internal server error' });
    }
});

// POST /v1/widget/event
// Logs a widget usage event for analytics
widgetRouter.post('/event', async (req: Request, res: Response) => {
    try {
        const { partner_id, event_type, session_id } = req.body;

        if (!partner_id || !event_type) {
            return res.status(400).json({ error: 'partner_id and event_type are required' });
        }

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');

        const { error } = await supabase
            .from('widget_events')
            .insert({ partner_id, event_type, session_id });

        if (error) {
            console.error('Widget Event Insert Error:', error);
            return res.status(500).json({ error: 'Failed to log event' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Widget Event Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /v1/widget/analytics/:partner_id
// Returns aggregated analytics for a partner (admin use)
widgetRouter.get('/analytics/:partner_id', async (req: Request, res: Response) => {
    try {
        const { partner_id } = req.params;

        const { data, error } = await supabase
            .from('widget_events')
            .select('event_type, recorded_at')
            .eq('partner_id', partner_id)
            .order('recorded_at', { ascending: false })
            .limit(500);

        if (error) throw error;

        // Simple aggregation
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const counts: Record<string, number> = {};
        (data || []).forEach((evt: { event_type: string }) => {
            counts[evt.event_type] = (counts[evt.event_type] || 0) + 1;
        });

        res.json({ events: data, summary: counts, total: data?.length || 0 });
    } catch (error) {
        console.error('Widget Analytics Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
