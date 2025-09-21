import { handleInputErrors } from '../src/modules/middleware';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

jest.mock('express-validator');

const mockedValidationResult = validationResult as jest.Mock;

describe('Handle Input Errors', () => {
  it('should return an error if any validation errors are present', async () => {
    const req = { body: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    mockedValidationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'error' }] });

    handleInputErrors(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'error' }] });
  });

  it('should proceed to the next middleware if no validation errors are present', async () => {
    const req = { body: {} } as Request;
    const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    mockedValidationResult.mockReturnValue({ isEmpty: () => true });

    handleInputErrors(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
