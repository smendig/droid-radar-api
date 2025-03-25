import express from 'express';
import morgan from 'morgan';
import { type AuditService } from './application/services/audit.service';
import { type TargetingService } from './application/services/targeting.service';
import { radarRoutes } from './infrastructure/api/routes/radar.routes';
import { auditRoutes } from './infrastructure/api/routes/audit.routes';


export function getApp(targetingService: TargetingService, auditService: AuditService): express.Application {
  const app = express();

  app.use(morgan('dev'));
  app.use(express.json());

  app.use('/radar', radarRoutes(targetingService, auditService));
  app.use('/audit', auditRoutes(auditService));
  return app;
}