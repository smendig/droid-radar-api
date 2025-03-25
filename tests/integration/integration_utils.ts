import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoAuditRepository } from '../../src/infrastructure/repositories/audit.repository';
import { MongoDatabase } from '../../src/infrastructure/database/mongo';

import { AuditService } from '../../src/application/services/audit.service';
import { TargetingService } from '../../src/application/services/targeting.service';
import { getApp } from '../../src/app';
import { RequestListener } from 'http';

let mongoServer: MongoMemoryServer;
let mongoDatabase: MongoDatabase;
let app: RequestListener;

export async function beforeIntegration() {
  mongoServer = await MongoMemoryServer.create();
  mongoDatabase = new MongoDatabase(mongoServer.getUri());
  await mongoDatabase.connect();
    
  const auditRepository = new MongoAuditRepository(mongoDatabase.getConnection());
  const auditService = new AuditService(auditRepository);
  const targetingService = new TargetingService();
    
  app = getApp(targetingService, auditService);
  return app;
}

export async function afterIntegration() {
  await mongoDatabase.disconnect();
  await mongoServer.stop();
}