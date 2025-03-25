import { Router } from 'express';
import { type AuditService } from '../../../application/services/audit.service';
import { type RadarService } from '../../../application/services/targeting.service';
import { scanDataSchema } from '../../../domain/scan-data';
import { ProtocolEnumArraySchema } from '../../../domain/protocol-types';
import { z } from 'zod';

export const radarRoutes = (radarService: RadarService, auditService: AuditService) => {
  const router = Router();

  router.post('/', async (req, res) => {
    try {
      const requestSchema = z.object({
        protocols: ProtocolEnumArraySchema,
        scan: scanDataSchema
      });
      const parsedBody = requestSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ errors: parsedBody.error.errors });
      }

      const { protocols: requestedProtocols, scan } = parsedBody.data;

      const targetCoordinates = await radarService.calculateTarget(requestedProtocols, scan);

      await auditService.saveAuditLog(requestedProtocols, scan, targetCoordinates);

      if (targetCoordinates) {
        return res.status(200).json(targetCoordinates);
      } 
      return res.status(404).json({ message: 'No target found based on protocols and scan data' });


    } catch (error) {
      console.error('Error processing radar scan:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
};