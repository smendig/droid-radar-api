import { Router } from 'express';
import { type AuditService } from '../../../application/services/audit.service';
import { ObjectId } from 'mongodb';

export const auditRoutes = (auditService: AuditService) => {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const auditLogs = await auditService.getAllAuditLogs();
      return res.status(200).json(auditLogs);
    } catch (error) {
      console.error('Error getting all audit logs:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;
  
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid audit log ID format' });
    }
  
    try {
      const auditLog = await auditService.getAuditLogById(id);
      if (!auditLog) {
        return res.status(404).json({ message: 'Audit log not found' });
      }
      return res.status(200).json(auditLog);
    } catch (error) {
      console.error('Error getting audit log by ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid audit log ID format' });
    }

    try {
      const deleted = await auditService.deleteAuditLogById(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Audit log not found' });
      }
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting audit log by ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
};