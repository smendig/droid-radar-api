import { startServer } from './server';
import { getApp } from './app';
import { MongoDatabase } from './infrastructure/database/mongo';
import { MongoAuditRepository } from './infrastructure/repositories/audit.repository';
import { AuditService } from './application/services/audit.service';
import { TargetingService } from './application/services/targeting.service';
import config from './config/config';

async function init() {
  const mongoDatabase = new MongoDatabase(config.mongo.uri);
  await mongoDatabase.connect();

  const auditRepository = new MongoAuditRepository(mongoDatabase.getConnection());
  const auditService = new AuditService(auditRepository);
  const targetingService = new TargetingService();

  console.log('Starting server...');
  startServer(getApp(targetingService, auditService));
}

init().catch((error) => {
  console.error('Server initialization failed:', error);
  process.exit(1);
});
