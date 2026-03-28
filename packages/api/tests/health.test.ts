import request from 'supertest';
import { app } from '../src/index'; // I need to export app from index.ts

describe('Health Check API', () => {
    it('should return 200 OK and status up', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
        expect(response.body.service).toBe('ally-ability-api');
        expect(response.body.timestamp).toBeDefined();
    });
});
