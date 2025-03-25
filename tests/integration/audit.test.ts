import request from 'supertest';
import { RequestListener } from 'http';
import { beforeIntegration, afterIntegration } from './integration_utils';

describe('Audit log API Integration Tests', () => {
  let app: RequestListener;

  beforeAll(async () => {
    app = await beforeIntegration();
  });
  afterAll(async () => {
    await afterIntegration();
  });

  it('should return empty array initially', async () => {
    const auditResponse = await request(app)
      .get('/audit')
      .expect(200);

    expect(auditResponse.body).toBeInstanceOf(Array);
    expect(auditResponse.body).toHaveLength(0);
  });


  it('add a first log and return a list of all the audit logs', async () => {
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
  
    const auditResponse = await request(app)
      .get('/audit')
      .expect(200)
      .then((res) => res.body);
  
    if (!Array.isArray(auditResponse)) {
      throw new Error('Audit response data is not an array');
    }
    expect(auditResponse).toHaveLength(1);
    expect(auditResponse[auditResponse.length - 1]).toMatchObject({
      id: expect.any(String),
      timestamp: expect.any(String),
      protocols: testData.protocols,
      scanData: testData.scan,
      targetCoordinates: response.body
    });
  });
  it('more logs and list all of them', async () => {
    const testData = {
      protocols: ['avoid-mech'],
      scan: [
        { coordinates: { x: 0, y: 80 }, enemies: { type: 'soldier', number: 10 } },
        { coordinates: { x: 0, y: 100 }, allies: 5, enemies: { type: 'mech', number: 1 } },
      ],
    };
    const response = await request(app)
      .post('/radar')
      .send(testData)
      .expect(200);
  
    const auditResponse = await request(app)
      .get('/audit')
      .expect(200)
      .then((res) => res.body);
  
    if (!Array.isArray(auditResponse)) {
      throw new Error('Audit response data is not an array');
    }
    expect(auditResponse).toHaveLength(2);
    expect(auditResponse[auditResponse.length - 1]).toMatchObject({
      id: expect.any(String),
      timestamp: expect.any(String),
      protocols: testData.protocols,
      scanData: testData.scan,
      targetCoordinates: response.body
    });
  });

  it('should get logs by id', async () => {
    const auditResponse = await request(app)
      .get('/audit')
      .expect(200)
      .then((res) => res.body);
  
    if (!Array.isArray(auditResponse)) {
      throw new Error('Audit response data is not an array');
    }
    expect(auditResponse).toHaveLength(2);

    const id1 = auditResponse[0].id;
    const getResponse1 = await request(app)
      .get(`/audit/${id1}`)
      .expect(200)
      .then((res) => res.body);

    expect(getResponse1).toMatchObject(auditResponse[0]);

    const id2 = auditResponse[0].id;
    const getResponse2 = await request(app)
      .get(`/audit/${id2}`)
      .expect(200)
      .then((res) => res.body);

    expect(getResponse1).toMatchObject(auditResponse[0]);
  });


  it('should delete logs by id', async () => {
    const auditResponse = await request(app)
      .get('/audit')
      .expect(200)
      .then((res) => res.body);
  
    if (!Array.isArray(auditResponse)) {
      throw new Error('Audit response data is not an array');
    }
    expect(auditResponse).toHaveLength(2);

    const id1 = auditResponse[0].id;
    await request(app)
      .delete(`/audit/${id1}`)
      .expect(204);
    
    await request(app)
      .get(`/audit/${id1}`)
      .expect(404);

    const id2 = auditResponse[1].id;
    await request(app)
      .get(`/audit/${id2}`)
      .expect(200)
      .then((res) => res.body);

    const auditResponse2 = await request(app)
      .get('/audit')
      .expect(200)
      .then((res) => res.body);
  
    if (!Array.isArray(auditResponse)) {
      throw new Error('Audit response data is not an array');
    }
    expect(auditResponse2).toHaveLength(1);
  });


  it('should return 404 for unsupported HTTP methods on /audit', async () => {
    await request(app)
      .put('/audit')
      .send({})
      .expect(404);
  });
});