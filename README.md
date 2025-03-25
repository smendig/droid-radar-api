# Droid Combat Radar API

A REST API for the New Republic's YVH combat droid targeting system, processing enemy targets using dynamic protocols and maintaining audit logs. Built with Express, TypeScript, and MongoDB.

## Features

- **Target Calculation**: `POST /radar` endpoint for protocol-based target selection
- **Audit System**: Track all calculations with `GET /audit` and `DELETE /audit/:id` endpoints
- **Protocol Engine**: Extensible system for combat protocols (closest-enemies, avoid-mech, etc.)
- **Persistent Storage**: MongoDB integration for audit logs
- **Validation**: Zod schema validation for all requests

## Quick Start

### Prerequisites

- Node.js v20+
- MongoDB 6+
- Docker (optional)

### Running Locally

```bash
# Development mode
npm run dev

# Production build
npm run build && npm start
```

## Testing

**Test Suite Includes:**

- Unit tests for protocol logic (Jest)
- Integration tests for API endpoints
- MongoDB in-memory server for test isolation

```bash
# Run all tests with coverage
npm test
```

## Docker

```bash
# Start with MongoDB (requires docker-compose.yml)
docker-compose up --build
```

**Note:** Environment variables are preconfigured for Docker in `docker-compose.yml` (adjust accordingly).

## API Documentation

### POST /radar

#### Determine target coordinates

```bash
curl -X POST http://localhost:3000/radar \
  -H "Content-Type: application/json" \
  -d '{
    "protocols": ["avoid-mech", "closest-enemies"],
    "scan": [{
      "coordinates": {"x": 0,"y": 40},
      "enemies": {"type":"soldier","number":10}
    }]
  }'
```

**Example Response Body:**

```json
{
  "x": 0,
  "y": 40
}
```

### GET /audit

#### List all calculations

```bash
curl http://localhost:3000/audit
```

**Example Response Body:**

```json
[
  {
    "_id": "65...",
    "timestamp": "2024-...",
    "protocols": ["closest-enemies"],
    "scanData": { ... },
    "targetCoordinates": { "x": 10, "y": 30 }
  },
  // ... more audit logs
]
```

### DELETE /audit/:id

#### Remove audit entry

```bash
curl -X DELETE http://localhost:3000/audit/507f191e810c19729de860ea
```

**Response:** `204 No Content` (on successful deletion)


## Notes

- Requires MongoDB connection. Ensure MongoDB is running locally or via Docker.
- Environment variables are loaded from `.env.dev`. Update this file with your MongoDB URI and other settings.
- Protocol implementations are designed to be easily extendable. Add new protocols by creating files in the `/src/application/protocols` directory.
