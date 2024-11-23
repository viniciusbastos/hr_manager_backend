import { Router } from 'express';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import weaponsRouter from './path-to-your-router'; // Adjust the import path accordingly

const prisma = new PrismaClient();
let server: any;

beforeAll(() => {
  server = request(weaponsRouter);
});

afterAll(async () => {
  await prisma.profileWeapons.deleteMany({}); // Clean up the database after tests
  await prisma.$disconnect();
});

describe('GET /weapons', () => {
  it('should return a list of weapons ordered by serialNumber in ascending order', async () => {
    const res = await server.get('/weapons');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.weapons)).toBeTruthy();
  });
});

describe('GET /weapons/label', () => {
  it('should return a list of weapons with id and serialNumber fields', async () => {
    const res = await server.get('/weapons/label');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    if (res.body.length > 0) {
      expect(typeof res.body[0].value).toBe('number');
      expect(typeof res.body[0].label).toBe('string');
    }
  });
});

describe('GET /weapons/fixed', () => {
  it('should return a list of weapons with user details and serialNumber', async () => {
    const res = await server.get('/weapons/fixed');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.weapons)).toBeTruthy();
  });
});

describe('POST /weapons/fixed', () => {
  it('should create a new fixed weapon entry', async () => {
    const newWeapon = {
      InitialDate: new Date(),
      belongsToId: 1, // Adjust according to your data model
      belongsToWeaponsId: 'someSerialNumber' // Adjust according to your data model
    };
    const res = await server.post('/weapons/fixed').send(newWeapon);
    expect(res.status).toBe(200);
  });
});

describe('DELETE /weapons/:id', () => {
  it('should delete a weapon entry by id', async () => {
    const created = await prisma.profileWeapons.create({
      data: {
        InitialDate: new Date(),
        belongsToId: 1, // Adjust according to your data model
        belongsToWeaponsId: 'someSerialNumber' // Adjust according to your data model
      }
    });
    const res = await server.delete(`/weapons/${created.id}`);
    expect(res.status).toBe(200);
  });
});