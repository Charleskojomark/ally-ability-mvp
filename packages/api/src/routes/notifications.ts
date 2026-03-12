import { Router, Request, Response } from 'express';
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from 'baileys';
import path from 'path';

export const notificationsRouter: Router = Router();

// WhatsApp connection state
let sock: ReturnType<typeof makeWASocket> | null = null;
let isConnected = false;

// Initialize WhatsApp connection (lazy — connects on first send attempt)
async function getWhatsAppSocket() {
    if (sock && isConnected) return sock;

    const authDir = path.join(process.cwd(), '.whatsapp-auth');
    const { state, saveCreds } = await useMultiFileAuthState(authDir);

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // Admin scans QR in server terminal
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            isConnected = false;
            const reason = (lastDisconnect?.error as any)?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                // Try reconnect
                console.log('[WhatsApp] Reconnecting...');
                sock = null;
                setTimeout(() => getWhatsAppSocket(), 5000);
            } else {
                console.log('[WhatsApp] Logged out. Scan QR again.');
                sock = null;
            }
        } else if (connection === 'open') {
            isConnected = true;
            console.log('[WhatsApp] Connected successfully!');
        }
    });

    return sock;
}

// Format phone number to WhatsApp JID
function toJid(phone: string): string {
    // Strip + and spaces, append @s.whatsapp.net
    const cleaned = phone.replace(/[^0-9]/g, '');
    return cleaned + '@s.whatsapp.net';
}

// POST /v1/notifications/whatsapp
// Send a single WhatsApp message
notificationsRouter.post('/whatsapp', async (req: Request, res: Response) => {
    try {
        const { phone, message } = req.body;

        if (!phone || !message) {
            return res.status(400).json({ error: 'phone and message are required' });
        }

        const wa = await getWhatsAppSocket();
        if (!wa || !isConnected) {
            return res.status(503).json({
                error: 'WhatsApp not connected. Please scan the QR code in the server terminal.',
            });
        }

        const jid = toJid(phone);
        await wa.sendMessage(jid, { text: message });

        console.log('[WhatsApp] Message sent to:', phone);
        return res.json({ success: true, phone, delivered: true });
    } catch (error) {
        console.error('[WhatsApp] Send Error:', error);
        res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }
});

// POST /v1/notifications/whatsapp/bulk
// Send a message to multiple phone numbers
notificationsRouter.post('/whatsapp/bulk', async (req: Request, res: Response) => {
    try {
        const { phones, message } = req.body;

        if (!phones || !Array.isArray(phones) || !message) {
            return res.status(400).json({ error: 'phones (array) and message are required' });
        }

        const wa = await getWhatsAppSocket();
        if (!wa || !isConnected) {
            return res.status(503).json({
                error: 'WhatsApp not connected. Scan QR in server terminal.',
            });
        }

        const results: Array<{ phone: string; success: boolean }> = [];

        for (const phone of phones) {
            try {
                const jid = toJid(phone);
                await wa.sendMessage(jid, { text: message });
                results.push({ phone, success: true });
            } catch {
                results.push({ phone, success: false });
            }
        }

        const sent = results.filter((r) => r.success).length;
        console.log('[WhatsApp] Bulk send:', sent, '/', phones.length);
        return res.json({ success: true, total: phones.length, sent, results });
    } catch (error) {
        console.error('[WhatsApp] Bulk Error:', error);
        res.status(500).json({ error: 'Bulk send failed' });
    }
});
