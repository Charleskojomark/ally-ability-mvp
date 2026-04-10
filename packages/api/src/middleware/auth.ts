import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';
const key = new TextEncoder().encode(secretKey);

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        [key: string]: any;
    };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
        req.user = {
            id: payload.sub as string,
            email: payload.email as string,
            role: payload.role as string
        };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token', details: (err as Error).message });
    }
};
