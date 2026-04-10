import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db, mentorshipSessions, championProfiles, users } from '@ally-ability/database';
import { eq, or } from 'drizzle-orm';
import { jwtVerify } from 'jose';

export const sessionsRouter: Router = Router();

async function sendBrevoEmail(toEmail: string, toName: string, subject: string, htmlContent: string) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return;
    try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'api-key': apiKey },
            body: JSON.stringify({
                sender: { name: "Ally-Ability Mentorship", email: "mentorship@ally-ability.com" },
                to: [{ email: toEmail, name: toName }],
                subject: subject,
                htmlContent: htmlContent
            })
        });
    } catch { }
}

const getJwtUser = async (req: Request) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    try {
        const { payload } = await jwtVerify(authHeader.split(' ')[1], new TextEncoder().encode(process.env.JWT_SECRET || 'your-jwt-secret-change-in-production'));
        return payload;
    } catch (e) { return null; }
}

sessionsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const user = await getJwtUser(req);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const { champion_id, scheduled_at, duration_minutes, notes } = req.body;
        if (!champion_id || !scheduled_at) return res.status(400).json({ error: 'champion_id and scheduled_at are required' });

        const [champion] = await db.select({ profile: championProfiles, users }).from(championProfiles).innerJoin(users, eq(users.id, championProfiles.user_id)).where(eq(championProfiles.id, champion_id)).limit(1);

        if (!champion) return res.status(404).json({ error: 'Champion profile not found' });

        const sessionId = crypto.randomUUID();
        const jitsi_room_name = `ally-session-${crypto.randomBytes(8).toString('hex')}`;

        await db.insert(mentorshipSessions).values({
            id: sessionId,
            champion_id: champion.profile.user_id,
            teacher_id: user.sub as string,
            scheduled_at: new Date(scheduled_at),
            duration_minutes: duration_minutes || 30,
            channel: 'in_app',
            status: 'pending',
            jitsi_room_name,
            notes,
            created_at: new Date()
        });

        // Skip emails for brevity in this task, or enable them natively
        sendBrevoEmail(champion.users.email, champion.users.full_name, 'New Mentorship Session Request', `<h2>You have a new Mentorship Request!</h2><p>Notes: ${notes || 'None provided'}</p>`);

        res.status(201).json({ id: sessionId });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

sessionsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const user = await getJwtUser(req);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const data = await db.select().from(mentorshipSessions).where(or(eq(mentorshipSessions.teacher_id, user.sub as string), eq(mentorshipSessions.champion_id, user.sub as string)));
        res.json({ sessions: data || [] }); // Basic payload
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

sessionsRouter.put('/:id/confirm', async (req: Request, res: Response) => {
    try {
        const user = await getJwtUser(req);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const [session] = await db.select().from(mentorshipSessions).where(eq(mentorshipSessions.id, req.params.id)).limit(1);
        if (!session || session.champion_id !== user.sub) return res.status(403).json({ error: 'Forbidden' });

        await db.update(mentorshipSessions).set({ status: 'confirmed' }).where(eq(mentorshipSessions.id, session.id));
        res.json({ success: true, status: 'confirmed' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

sessionsRouter.put('/:id/cancel', async (req: Request, res: Response) => {
    await db.update(mentorshipSessions).set({ status: 'cancelled' }).where(eq(mentorshipSessions.id, req.params.id));
    res.json({ success: true, status: 'cancelled' });
});

sessionsRouter.put('/:id/complete', async (req: Request, res: Response) => {
    await db.update(mentorshipSessions).set({ status: 'completed' }).where(eq(mentorshipSessions.id, req.params.id));
    res.json({ success: true, status: 'completed' });
});
