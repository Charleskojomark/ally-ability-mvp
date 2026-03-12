import { Router } from 'express';

export const jobsRouter: Router = Router();

// GET /jobs
jobsRouter.get('/', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// GET /jobs/:id
jobsRouter.get('/:id', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /jobs (admin/partner only)
jobsRouter.post('/', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// PUT /jobs/:id
jobsRouter.put('/:id', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// GET /employers
jobsRouter.get('/employers', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
