const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const prisma = require('@prisma/client');
const { registerRoutes } = require('./routes');
const fastifySwagger = require('@fastify/swagger');
const fastifyStatic = require('@fastify/static');
const path = require('path');

// Register Swagger
fastify.register(fastifySwagger, {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Account and Payment API',
      description: 'API documentation for the account and payment management service',
      version: '1.0.0'
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'user', description: 'User related end-points' },
      { name: 'transaction', description: 'Transaction related end-points' }
    ]
  },
  exposeRoute: true
});

// Enable CORS
fastify.register(cors, { origin: true });

// Initialize Prisma Client
const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

// Register Routes
registerRoutes(fastify, prismaClient);

// Serve Static Files
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/public/', // optional: default '/'
});

// Start Server
const start = async () => {
  try {
    const address = await fastify.listen({
      port: 3000,
      host: '0.0.0.0'
    });
    fastify.log.info(`Server listening on ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
