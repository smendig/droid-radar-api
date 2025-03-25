import request from 'supertest';
import { RequestListener } from 'http';
import { beforeIntegration, afterIntegration } from './integration_utils';

describe('Radar API Integration Tests', () => {
  let app: RequestListener;

  beforeAll(async () => {
    app = await beforeIntegration();
  });

  afterAll(async () => {
    await afterIntegration();
  });

  it('should return 400 when invalid data is sent', async () => {
    const testData = {
      protocols: ['avoid-mech'],
    };
    await request(app)
      .post('/radar')
      .send(testData)
      .expect(400);
  });
  it('should return 400 when invalid data is sent', async () => {
    const testData = {
      protocols: ['invalid-protocol'],
      scan: [
        { coordinates: { x: 0, y: 40 }, enemies: { type: 'soldier', number: 10 } },
        { coordinates: { x: 0, y: 80 }, allies: 5, enemies: { type: 'mech', number: 1 } },
      ],
    };
    const response = await request(app)
      .post('/radar')
      .send(testData)
      .expect(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should return 400 when the request body is invalid', async () => {
    const invalidTestData = {
      protocols: ['avoid-mech'],
      scan: 'invalid',
    };

    const response = await request(app)
      .post('/radar')
      .send(invalidTestData)
      .expect(400);

    expect(response.body.errors).toBeDefined();
  });

  it('should return 200 and target coordinates when a valid request is made', async () => {
    const testData = {
      protocols: ['avoid-mech'],
      scan: [
        { coordinates: { x: 0, y: 40 }, enemies: { type: 'soldier', number: 10 } },
        { coordinates: { x: 0, y: 80 }, allies: 5, enemies: { type: 'mech', number: 1 } },
      ],
    };

    const response = await request(app)
      .post('/radar')
      .send(testData)
      .expect(200);

    expect(response.body).toEqual({ x: 0, y: 40 });

    const auditResponse = await request(app)
      .get('/audit')
      .expect(200)
      .then((res) => res.body);

    if (!Array.isArray(auditResponse)) {
      throw new Error('Audit response data is not an array');
    }
    expect(auditResponse[auditResponse.length - 1]).toMatchObject({
      id: expect.any(String),
      timestamp: expect.any(String),
      protocols: testData.protocols,
      scanData: testData.scan,
      targetCoordinates: { x: 0, y: 40 }
    });
  });


  it('should return 404 when no target is found', async () => {
    const testData = {
      protocols: ['avoid-mech'],
      scan: [
        { coordinates: { x: 0, y: 40 }, enemies: { type: 'mech', number: 10 } },
        { coordinates: { x: 0, y: 80 }, allies: 5, enemies: { type: 'mech', number: 1 } },
      ],
    };
    await request(app)
      .post('/radar')
      .send(testData)
      .expect(404);
  });

  it('should have audit log of previous requests', async () => {

    const auditResponse = await request(app)
      .get('/audit')
      .expect(200)
      .then((res) => res.body);

    if (!Array.isArray(auditResponse)) {
      throw new Error('Audit response data is not an array');
    }
    expect(auditResponse).toHaveLength(2);
  });
});
