import { MongoDatabase } from '../infrastructure/database/mongo';
import config from '../config/config';
import { ObjectId } from 'mongodb';

async function deleteLog(id: string) {
  if (!ObjectId.isValid(id)) {
    console.error('Invalid ID');
    return;
  }
  const mongoDatabase = new MongoDatabase(config.mongo.uri);
  try {
    await mongoDatabase.connect();
    const db = mongoDatabase.getConnection();
    const result = await db.collection('audit_logs').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      console.log(`Log with ID ${id} deleted successfully.`);
    } else {
      console.log(`Log with ID ${id} not found.`);
    }
  } catch (error) {
    console.error('Error deleting log:', error);
  } finally {
    await mongoDatabase.disconnect();
  }
}

const logId = process.argv[2]; // Get ID from command-line argument
if (logId) {
  deleteLog(logId);
} else {
  console.error('Please provide a log ID as an argument.');
}