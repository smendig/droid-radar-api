import { ProtocolEnum } from '../../domain/protocol-types';
import { AuditLog, AuditRepository } from '../../infrastructure/repositories/audit.repository';

export class AuditService {
  private auditRepository: AuditRepository;

  constructor(auditRepository: AuditRepository) {
    this.auditRepository = auditRepository;
  }

  async saveAuditLog(requestedProtocols: ProtocolEnum[], scanData: unknown, targetCoordinates: { x: number, y: number } | null): Promise<AuditLog> {
    const auditLogData = {
      timestamp: new Date(),
      protocols: requestedProtocols,
      scanData: scanData,
      targetCoordinates: targetCoordinates,
    };
    const id = await this.auditRepository.save(auditLogData);
    const auditLog = await this.auditRepository.findById(id);
    if (!auditLog) {
      throw new Error('Failed to save audit log');
    }
    return auditLog;
  }

  async getAuditLogById(id: string): Promise<AuditLog | null> {
    return this.auditRepository.findById(id);
  }

  async getAllAuditLogs(): Promise<AuditLog[]> {
    return this.auditRepository.getAll();
  }

  async deleteAuditLogById(id: string): Promise<boolean> {
    return this.auditRepository.deleteById(id);
  }
}