import { Router, Request, Response } from 'express';
import { db, safetyReports, users } from '@ally-ability/database';
import { eq, desc } from 'drizzle-orm';
import { jwtVerify } from 'jose';
import crypto from 'crypto';

export const safetyRouter: Router = Router();

async function sendBrevoEmail(subject: string, htmlContent: string) {
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) return;

    try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': brevoApiKey
            },
            body: JSON.stringify({
                sender: { name: "Ally-Ability Platform", email: "noreply@ally-ability.com" },
                to: [{ email: process.env.MODERATOR_EMAIL || "safety@ally-ability.com", name: "Moderation Team" }],
                subject: subject,
                htmlContent: htmlContent
            })
        });
    } catch (error) {
        console.error('Failed to dispatch Brevo Email');
    }
}

safetyRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { category, description, is_anonymous } = req.body;
        if (!category || !description) return res.status(400).json({ error: 'Category and description are required.' });

        let user_id = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ') && !is_anonymous) {
            const token = authHeader.split(' ')[1];
            try {
                const key = new TextEncoder().encode(process.env.JWT_SECRET || 'your-jwt-secret-change-in-production');
                const { payload } = await jwtVerify(token, key);
                user_id = payload.sub as string;
            } catch (e) { }
        }

        const reportId = crypto.randomUUID();
        await db.insert(safetyReports).values({
            id: reportId,
            reporter_id: user_id,
            description: `[${category}] ${description}`,
            status: 'submitted',
            severity: 'medium',
            created_at: new Date()
        });

        const emailSubject = `⚠️ New Safe Space Report: [${category}]`;
        const emailHtml = `<h2>New Safety Report Submitted</h2><p><strong>Category:</strong> ${category}</p><p><strong>Anonymous:</strong> ${is_anonymous ? 'Yes' : 'No'}</p><p><strong>Reported By User ID:</strong> ${user_id || 'N/A'}</p><hr /><h3>Description:</h3><p>${description.replace(/\n/g, '<br/>')}</p>`;
        sendBrevoEmail(emailSubject, emailHtml);

        return res.status(201).json({ success: true, message: 'Report submitted successfully.', report_id: reportId });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

safetyRouter.get('/', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
        const token = authHeader.split(' ')[1];

        let role = null;
        try {
            const key = new TextEncoder().encode(process.env.JWT_SECRET || 'your-jwt-secret-change-in-production');
            const { payload } = await jwtVerify(token, key);
            role = payload.role;
        } catch (e) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        if (role !== 'admin' && role !== 'moderator') return res.status(403).json({ error: 'Forbidden' });

        const result = await db.select({
            report: safetyReports,
            user: { full_name: users.full_name, email: users.email }
        }).from(safetyReports)
            .leftJoin(users, eq(safetyReports.reporter_id, users.id))
            .orderBy(desc(safetyReports.created_at));

        return res.json(result.map(r => ({ ...r.report, users: r.user })));
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

safetyRouter.put('/:id/status', async (req: Request, res: Response) => {
    try {
        const reportId = req.params.id;
        const { status } = req.body;
        if (!status) return res.status(400).json({ error: 'Status is required' });

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

        const token = authHeader.split(' ')[1];
        let role = null;
        try {
            const key = new TextEncoder().encode(process.env.JWT_SECRET || 'your-jwt-secret-change-in-production');
            const { payload } = await jwtVerify(token, key);
            role = payload.role;
        } catch (e) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        if (role !== 'admin' && role !== 'moderator') return res.status(403).json({ error: 'Forbidden' });

        await db.update(safetyReports).set({ status: status as any }).where(eq(safetyReports.id, reportId));
        return res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
