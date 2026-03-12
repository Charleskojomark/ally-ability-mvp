import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

// Initialize a Supabase client just for verifying tokens
const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token', details: error?.message });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error verifying token' });
    }
};
