import request from 'supertest';
import express from 'express';
import weaponsRouter from '../src/routes/weapons.routes'; // Adjust the path as needed
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json());
app.use('/api', weaponsRouter);

jest.mock('@prisma/client');
const MockedPrismaClient = PrismaClient as jest.Mock<PrismaClient>

describe('Weapons Router', () => {
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      weapons: {
        findMany: jest.fn(),
      },
      profileWeapons: {
        create: jest.fn(),
        delete: jest.fn(),
      },
      $queryRaw: jest.fn(),
    };
    MockedPrismaClient.mockImplementation(() => mockPrisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/weapons should return all weapons', async () => {
    const mockWeapons = [{ id: 1, serialNumber: 'ABC123' }];
    mockPrisma.weapons.findMany.mockResolvedValue(mockWeapons);

    const response = await request(app).get('/api/weapons');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ weapons: mockWeapons });
    expect(mockPrisma.weapons.findMany).toHaveBeenCalledWith({
      orderBy: { serialNumber: 'asc' },
    });
  });

  it('GET /api/weapons/label should return weapons labels', async () => {
    const mockLabels = [{ value: 1, label: 'ABC123' }];
    mockPrisma.$queryRaw.mockResolvedValue(mockLabels);

    const response = await request(app).get('/api/weapons/label');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLabels);
    expect(mockPrisma.$queryRaw).toHaveBeenCalled();
  });

  it('GET /api/weapons/fixed should return fixed weapons data', async () => {
    const mockFixedData = [{ mat: '123', posto: 'Sgt', name: 'John Doe', model: 'M4', serialNumber: 'ABC123' }];
    mockPrisma.$queryRaw.mockResolvedValue(mockFixedData);

    const response = await request(app).get('/api/weapons/fixed');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockFixedData);
    expect(mockPrisma.$queryRaw).toHaveBeenCalled();
  });

  it('GET /api/weaponprofile/:id should return weapon profile by id', async () => {
    const mockProfile = [{ mat: '123', posto: 'Sgt', name: 'John Doe', model: 'M4', serialNumber: 'ABC123' }];
    mockPrisma.$queryRaw.mockResolvedValue(mockProfile);

    const response = await request(app).get('/api/weaponprofile/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ weapons: mockProfile });
    expect(mockPrisma.$queryRaw).toHaveBeenCalled();
  });

  it('POST /api/weapons/fixed should create a new weapon profile', async () => {
    const mockCreatedProfile = { id: 1, InitialDate: new Date(), belongsToId: 1, belongsToWeaponsId: 'ABC123' };
    mockPrisma.profileWeapons.create.mockResolvedValue(mockCreatedProfile);

    const response = await request(app)
      .post('/api/weapons/fixed')
      .send({ InitialDate: '2023-01-01', belongsToId: 1, serialNumber: 'ABC123' });

    expect(response.status).toBe(200);
    expect(mockPrisma.profileWeapons.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        InitialDate: expect.any(Date),
        belongsToId: 1,
        belongsToWeaponsId: 'ABC123',
      }),
    });
  });

  it('DELETE /api/weapons/:id should delete a weapon profile', async () => {
    const mockDeletedProfile = { id: 1 };
    mockPrisma.profileWeapons.delete.mockResolvedValue(mockDeletedProfile);

    const response = await request(app).delete('/api/weapons/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: mockDeletedProfile });
    expect(mockPrisma.profileWeapons.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});