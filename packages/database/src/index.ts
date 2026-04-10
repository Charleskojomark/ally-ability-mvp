import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Need to load env if outside of Next.js Context
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
    throw new Error('TURSO_DATABASE_URL is not set in the environment variables.');
}

const client = createClient({
    url,
    authToken,
});

export const db = drizzle(client, { schema });
export * from './schema';
