const userController = require('../controllers/userController');
const transactionController = require('../controllers/transactionController');

function registerRoutes(fastify, prismaClient) {
  // User routes
  fastify.post('/register', {
    schema: {
      description: 'Register a new user',
      tags: ['user'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' }
        }
      }
    }
  }, (request, reply) => userController.register(request, reply, prismaClient));

  fastify.post('/login', {
    schema: {
      description: 'Login a user',
      tags: ['user'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' }
        }
      }
    }
  }, (request, reply) => userController.login(request, reply, prismaClient));

  // Transaction routes
  fastify.post('/send', {
    schema: {
      description: 'Send money',
      tags: ['transaction'],
      body: {
        type: 'object',
        required: ['amount', 'toAddress', 'accountId'],
        properties: {
          amount: { type: 'number' },
          toAddress: { type: 'string' },
          accountId: { type: 'integer' }
        }
      }
    }
  }, (request, reply) => transactionController.send(request, reply, prismaClient));

  fastify.post('/withdraw', {
    schema: {
      description: 'Withdraw money',
      tags: ['transaction'],
      body: {
        type: 'object',
        required: ['amount', 'accountId'],
        properties: {
          amount: { type: 'number' },
          accountId: { type: 'integer' }
        }
      }
    }
  }, (request, reply) => transactionController.withdraw(request, reply, prismaClient));

  fastify.get('/accounts', {
    schema: {
      description: 'Get user accounts',
      tags: ['user']
    }
  }, (request, reply) => userController.getAccounts(request, reply, prismaClient));

  fastify.get('/transactions/:accountId', {
    schema: {
      description: 'Get transactions for an account',
      tags: ['transaction'],
      params: {
        type: 'object',
        required: ['accountId'],
        properties: {
          accountId: { type: 'integer' }
        }
      }
    }
  }, (request, reply) => transactionController.getTransactions(request, reply, prismaClient));
}

module.exports = { registerRoutes };
