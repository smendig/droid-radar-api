import http from 'http';
import type express from 'express';
import config from './config/config';

export function startServer(app: express.Application): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> {
  const server = http.createServer(app);
  const PORT = config.server.port;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (error: Error) => {
    console.error('Server error:', error);
  });

  return server;
}