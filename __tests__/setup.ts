import { jest } from '@jest/globals';


jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    weapons: {
      findMany: jest.fn(),
    },
    profileWeapons: {
      create: jest.fn(),
      delete: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $transaction: jest.fn((fn) => fn(mockPrisma)),
  })),
}));

jest.mock('../src/redis/client.js', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    exists: jest.fn(),
    flushAll: jest.fn(),
    isReady: true,
    on: jest.fn(),
    connect: jest.fn(),
  },
}));

jest.mock('../src/modules/auth.js', () => ({
  __esModule: true,
  protect: (req, res, next) => next(),
}));

export const mockPrisma = new (require('@prisma/client').PrismaClient)();
export const mockRedis = require('../src/redis/client.js').default;
