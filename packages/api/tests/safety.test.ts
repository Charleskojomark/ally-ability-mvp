import request from 'supertest';
import { app } from '../src/index';
import { supabase } from '../src/lib/supabase';

describe('Safety Routes (Safe Space)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should submit an anonymous safe space report successfully', async () => {
        // Mock the Supabase chain: from('safety_reports').insert().select().single()
        const mockSingle = jest.fn().mockResolvedValue({
            data: { id: 'test-report-123' },
            error: null
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });

        (supabase.from as jest.Mock).mockReturnValue({
            insert: mockInsert
        });

        const reportPayload = {
            category: 'Harassment',
            description: 'Test description',
            is_anonymous: true
        };

        const response = await request(app)
            .post('/v1/safety-reports')
            .send(reportPayload);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.report_id).toBe('test-report-123');

        // Verify Supabase was called correctly
        expect(supabase.from).toHaveBeenCalledWith('safety_reports');
        expect(mockInsert).toHaveBeenCalledWith({
            user_id: null,
            category: reportPayload.category,
            description: reportPayload.description,
            is_anonymous: true,
            status: 'pending'
        });
    });

    it('should return 400 if category or description is missing', async () => {
        const response = await request(app)
            .post('/v1/safety-reports')
            .send({
                category: 'Harassment', // missing description
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Category and description are required.');
    });
});
