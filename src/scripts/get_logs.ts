import { MongoDatabase } from '../infrastructure/database/mongo';
import config from '../config/config';
import { ObjectId } from 'mongodb';

async function getLog(id: string) {
  if (!ObjectId.isValid(id)) {
    console.error('Invalid ID');
    return;
  }
  const mongoDatabase = new MongoDatabase(config.mongo.uri);
  try {
    await mongoDatabase.connect();
    const db = mongoDatabase.getConnection();
    const log = await db.collection('audit_logs').findOne({ _id: new ObjectId(id) });

    if (log) {
      console.log('Audit Log Details:');
      console.log(JSON.stringify(log, null, 2));
    } else {
      console.log(`Log with ID ${id} not found.`);
    }
  } catch (error) {
    console.error('Error getting log:', error);
  } finally {
    await mongoDatabase.disconnect();
  }
}

const logId = process.argv[2]; // Get ID from command-line argument
if (logId) {
  getLog(logId);
} else {
  console.error('Please provide a log ID as an argument.');
}