interface Config {
  server: {
    port: number;
  };
  mongo: {
    uri: string;
  };
}

function getPortFromEnv(): number {
  if (!process.env.PORT) {
    throw new Error('PORT is required');
  }
  const port = parseInt(process.env.PORT, 10);
  if (isNaN(port)) {
    throw new Error('Invalid port number');
  }
  return port;
}

function getMongoUriFromEnv(): string {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }
  return process.env.MONGO_URI;
}

const config: Config = {
  server: {
    port: getPortFromEnv(),
  },
  mongo: {
    uri: getMongoUriFromEnv(),
  },
};

export default config;