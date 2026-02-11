import type { NextFunction, Request, Response } from 'express';
import { fail, type ApiResponse } from '../utils/response';

function getStatusCode(err: unknown) {
  if (typeof err === 'object' && err !== null && 'statusCode' in err) {
    const maybe = (err as { statusCode?: unknown }).statusCode;
    if (typeof maybe === 'number') return maybe;
  }
  return 500;
}

function getMessage(err: unknown, statusCode: number) {
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const maybe = (err as { message?: unknown }).message;
    if (typeof maybe === 'string' && maybe.trim()) return maybe;
  }

  return statusCode === 500 ? 'Internal server error' : 'Request failed';
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response<ApiResponse<never>>,
  _next: NextFunction,
) {
  const statusCode = getStatusCode(err);
  const message = getMessage(err, statusCode);
  return fail(res, message, statusCode);
}
