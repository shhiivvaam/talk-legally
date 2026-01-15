# Deployment Guide

## Prerequisites
- Docker and Docker Compose
- Node.js 18+
- PostgreSQL 14+
- MongoDB 6+
- Redis 7+

## Local Development Setup

1. Clone the repository
2. Start databases:
   ```bash
   cd docker
   docker-compose up -d
   ```

3. Run database migrations:
   ```bash
   psql -U postgres -d talk_legally -f ../database/migrations/001_initial_schema.sql
   ```

4. Install dependencies for each service:
   ```bash
   cd backend/services/auth-service && npm install
   # Repeat for all services
   ```

5. Set up environment variables (create `.env` files in each service)

6. Start services:
   ```bash
   # In separate terminals
   npm run start:dev
   ```

## Production Deployment

1. Build Docker images:
   ```bash
   docker build -t talk-legally-api-gateway -f docker/Dockerfile.api-gateway .
   ```

2. Use Kubernetes or Docker Swarm for orchestration

3. Set up environment variables in your cloud provider

4. Configure load balancer and SSL certificates

5. Set up monitoring and logging (Prometheus, Grafana, ELK)

## Environment Variables

Required environment variables for each service are documented in `.env.example` files.
