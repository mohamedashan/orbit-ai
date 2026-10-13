import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import http from 'node:http';
import { server } from './index.js';

const request = (method, path, body) => new Promise((resolve, reject) => {
  const req = http.request({ method, port: server.address().port, path, headers: { 'Content-Type': 'application/json' } }, res => {
    let data = ''; res.on('data', c => { data += c; }); res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
  });
  req.on('error', reject); if (body) req.write(JSON.stringify(body)); req.end();
});

describe('Orbit API', () => {
  beforeAll(() => server.listen(0));
  afterAll(() => server.close());
  it('reports service health', async () => { const result = await request('GET', '/api/health'); expect(result.status).toBe(200); expect(result.body.ok).toBe(true); });
  it('rejects empty prompts', async () => { const result = await request('POST', '/api/ask', {}); expect(result.status).toBe(400); expect(result.body.error).toMatch(/message is required/i); });
  it('returns a useful demo response without a provider key', async () => { const originalKey = process.env.OPENAI_API_KEY; delete process.env.OPENAI_API_KEY; const result = await request('POST', '/api/ask', { message: 'Plan a launch' }); if (originalKey) process.env.OPENAI_API_KEY = originalKey; expect(result.status).toBe(200); expect(result.body.demo).toBe(true); expect(result.body.answer).toContain('Plan a launch'); });
});
