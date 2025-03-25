import { Db, Collection, ObjectId, DeleteResult } from 'mongodb';
import { ProtocolEnum } from '../../domain/protocol-types';

interface AuditLogDocument {
    _id: ObjectId;
    timestamp: Date;
    requestId?: string;
    protocols: ProtocolEnum[];
    scanData: unknown;
    targetCoordinates: { x: number, y: number } | null;
}
export interface AuditLog {
    id: string;
    timestamp: Date;
    requestId?: string;
    protocols: ProtocolEnum[];
    scanData: unknown;
    targetCoordinates: { x: number, y: number } | null;
}
type AuditLogNoId = Omit<AuditLog, 'id'>;

export interface AuditRepository {
    save(auditLog: AuditLogNoId): Promise<string>;
    findById(id: string): Promise<AuditLog | null>;
    getAll(): Promise<AuditLog[]>;
    deleteById(id: string): Promise<boolean>;
}

export class MongoAuditRepository implements AuditRepository {
  private auditCollection: Collection<AuditLogDocument>;

  constructor(db: Db) {
    this.auditCollection = db.collection<AuditLogDocument>('audit_logs');
  }

  private mapDocumentToModel(document: AuditLogDocument): AuditLog {
    return {
      id: document._id.toHexString(),
      timestamp: document.timestamp,
      requestId: document.requestId,
      protocols: document.protocols,
      scanData: document.scanData,
      targetCoordinates: document.targetCoordinates,
    };
  }

  async save(auditLog: AuditLogNoId): Promise<string> {
    const logToSave: AuditLogDocument = {
      _id: new ObjectId(),
      ...auditLog,
    };
    const result = await this.auditCollection.insertOne(logToSave);
    return result.insertedId.toHexString();

  }

  async findById(id: string): Promise<AuditLog | null> {
    const objectId = new ObjectId(id);
    const document = await this.auditCollection.findOne({ _id: objectId });
    if (!document) {
      return null;
    }
    return this.mapDocumentToModel(document);
  }

  async getAll(): Promise<AuditLog[]> {
    const logs = await this.auditCollection.find({}).toArray();
    return logs.map(this.mapDocumentToModel);
  }

  async deleteById(id: string): Promise<boolean> {
    const objectId = new ObjectId(id);
    const result: DeleteResult = await this.auditCollection.deleteOne({ _id: objectId });
    return result.deletedCount === 1;
  }
}