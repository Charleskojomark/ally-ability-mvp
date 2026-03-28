import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const safetyRouter: Router = Router();

// Helper function to send email via Brevo API
async function sendBrevoEmail(subject: string, htmlContent: string) {
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
        console.warn('BREVO_API_KEY not defined, skipping email notification');
        return;
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
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

        if (!response.ok) {
            console.error('Brevo API Error:', await response.text());
        }
    } catch (error) {
        console.error('Failed to dispatch Brevo Email:', error);
    }
}

// POST /v1/safety-reports
// Allows anonymous submissions, so we don't strictly require authentication middleware.
// Attempt to extract user_id if token provided.
safetyRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { category, description, is_anonymous } = req.body;

        if (!category || !description) {
            return res.status(400).json({ error: 'Category and description are required.' });
        }

        let user_id = null;

        // Optional auth check to map user if not anonymous
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ') && !is_anonymous) {
            const token = authHeader.split(' ')[1];
            const { data: { user }, error: authError } = await supabase.auth.getUser(token);
            if (!authError && user) {
                user_id = user.id;
            }
        }

        // Insert to DB
        const { data: report, error } = await supabase
            .from('safety_reports')
            .insert({
                user_id,
                category,
                description,
                is_anonymous: Boolean(is_anonymous),
                status: 'pending' // Default schema status
            })
            .select('*')
            .single();

        if (error) {
            console.error('Supabase Insert Error:', error);
            return res.status(500).json({ error: 'Failed to save report.' });
        }

        // Dispatch email notification to moderators (non-blocking)
        const emailSubject = `⚠️ New Safe Space Report: [${category}]`;
        const emailHtml = `
      <h2>New Safety Report Submitted</h2>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Anonymous:</strong> ${is_anonymous ? 'Yes' : 'No'}</p>
      <p><strong>Reported By User ID:</strong> ${user_id || 'N/A'}</p>
      <hr />
      <h3>Description:</h3>
      <p>${description.replace(/\n/g, '<br/>')}</p>
      <hr />
      <p><small>Please review via the Admin Safety Dashboard.</small></p>
    `;

        sendBrevoEmail(emailSubject, emailHtml);

        return res.status(201).json({
            success: true,
            message: 'Report submitted successfully.',
            report_id: report.id
        });

    } catch (error) {
        console.error('Safe Space POST Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /v1/safety-reports
// Fetch all reports (Admin/Moderator only)
safetyRouter.get('/', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Check role
        if (user.user_metadata?.role !== 'admin' && user.user_metadata?.role !== 'moderator') {
            return res.status(403).json({ error: 'Forbidden: Requires admin or moderator role' });
        }

        // Fetch reports
        const { data: reports, error } = await supabase
            .from('safety_reports')
            // Using a simple select, but we can also join with users if we want to show usernames later
            .select(`
                *,
                users:user_id ( full_name, email )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch Safety Reports Error:', error);
            return res.status(500).json({ error: 'Failed to fetch reports' });
        }

        return res.json(reports);
    } catch (error) {
        console.error('GET /safety-reports Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /v1/safety-reports/:id/status
// Update report status (Admin/Moderator only)
safetyRouter.put('/:id/status', async (req: Request, res: Response) => {
    try {
        const reportId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        if (user.user_metadata?.role !== 'admin' && user.user_metadata?.role !== 'moderator') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // We use the service role client configured at the top to bypass RLS, ensuring the update succeeds
        // As long as the requester is an admin/moderator, we trust the action.
        const { data: report, error } = await supabase
            .from('safety_reports')
            .update({ status })
            .eq('id', reportId)
            .select()
            .single();

        if (error) {
            console.error('Update Safety Report Error:', error);
            return res.status(500).json({ error: 'Failed to update report' });
        }

        return res.json({ success: true, report });
    } catch (error) {
        console.error('PUT /safety-reports/:id/status Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
