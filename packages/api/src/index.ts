import express, { Application, Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../.env' });

import { authRouter } from './routes/auth';
import { coursesRouter } from './routes/courses';
import { enrolmentsRouter } from './routes/enrolments';
import { championsRouter } from './routes/champions';
import { sessionsRouter } from './routes/sessions';
import { safetyRouter } from './routes/safety';
import { jobsRouter } from './routes/jobs';
import { widgetRouter } from './routes/widget';
import { chatRouter } from './routes/chat';
import { usersRouter } from './routes/users';
import { videosRouter } from './routes/videos';
import { notificationsRouter } from './routes/notifications';

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

import path from 'path';
// Serve uploaded files securely (videos, etc.)
app.use('/v1/public', express.static(path.join(process.cwd(), 'public'), {
    maxAge: '1d',
    setHeaders: (res, path) => {
        // Set cross-origin headers to allow video playback from the frontend
        res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'ally-ability-api', timestamp: new Date().toISOString() });
});

// API Routes (all prefixed with /v1)
const v1: Router = express.Router();
v1.use('/auth', authRouter);
v1.use('/courses', coursesRouter);
v1.use('/enrolments', enrolmentsRouter);
v1.use('/champions', championsRouter);
v1.use('/sessions', sessionsRouter);
v1.use('/safety-reports', safetyRouter);
v1.use('/jobs', jobsRouter);
v1.use('/widget', widgetRouter);
v1.use('/chat', chatRouter);
v1.use('/users', usersRouter);
v1.use('/videos', videosRouter);
v1.use('/notifications', notificationsRouter);

app.use('/v1', v1);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Ally-Ability API running on http://localhost:${PORT}`);
        console.log(`   Health check: http://localhost:${PORT}/health`);
    });
}

export default app;
export { app };
