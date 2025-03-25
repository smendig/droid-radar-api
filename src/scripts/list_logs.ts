import { MongoDatabase } from '../infrastructure/database/mongo';
import config from '../config/config';

async function listLogs() {
  const mongoDatabase = new MongoDatabase(config.mongo.uri);
  try {
    await mongoDatabase.connect();
    const db = mongoDatabase.getConnection();
    const auditLogs = await db.collection('audit_logs').find({}).toArray();

    console.log('Audit Logs (most recent first):');
    console.log(JSON.stringify(auditLogs, null, 2));
  } catch (error) {
    console.error('Error listing logs:', error);
  } finally {
    await mongoDatabase.disconnect();
  }
}

listLogs();