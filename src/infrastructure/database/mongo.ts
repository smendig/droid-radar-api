import { MongoClient, Db, MongoClientOptions } from 'mongodb';

export class MongoDatabase {
  private client: MongoClient;
  private db: Db | null = null;
  private connectionUri: string;
  private readonly connectionTimeoutMs: number;

  constructor(connectionUri: string, connectionTimeoutMs: number = 5000) {
    this.connectionUri = connectionUri;
    this.connectionTimeoutMs = connectionTimeoutMs;
    const options: MongoClientOptions = {
      serverSelectionTimeoutMS: this.connectionTimeoutMs,
    };
    this.client = new MongoClient(this.connectionUri, options);
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db();
    console.log('Connected to MongoDB');
  }

  getConnection(): Db {
    if (!this.db) {
      throw new Error('Database connection not initialized. Call connect() first.');
    }
    return this.db;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close().catch((error) => {
        console.error('Error closing MongoDB connection:', error);
      });
      console.log('Disconnected from MongoDB');
    }
  }
}
