import { config } from 'dotenv';
import path from 'path';

// Load environment variables from the root .env before running tests
config({ path: path.resolve(__dirname, '../../../.env') });

// Mock Supabase to prevent actual network calls during unit tests
jest.mock('@/lib/supabase', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

// Also globally mock the supabase-js package for routes that initialize their own client
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn().mockReturnValue({
        auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }) },
        from: jest.fn().mockReturnValue({
            insert: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn() }) }),
            select: jest.fn().mockReturnValue({ order: jest.fn() }),
            update: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn() }) }) })
        })
    })
}));

// Mock ESM dependent library `baileys` to prevent transformation errors during tests
jest.mock('baileys', () => ({
    __esModule: true,
    default: jest.fn(),
    DisconnectReason: {},
    useMultiFileAuthState: jest.fn().mockResolvedValue({ state: {}, saveCreds: jest.fn() }),
}));
