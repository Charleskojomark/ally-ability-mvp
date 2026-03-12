import { Router } from 'express';

export const authRouter: Router = Router();

// POST /auth/register
authRouter.post('/register', async (_req, res) => {
    // TODO: Phase 3 — Supabase auth integration
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /auth/login
authRouter.post('/login', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /auth/logout
authRouter.post('/logout', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /auth/forgot-password
authRouter.post('/forgot-password', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /auth/reset-password
authRouter.post('/reset-password', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// GET /auth/me
authRouter.get('/me', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// PUT /auth/me
authRouter.put('/me', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
