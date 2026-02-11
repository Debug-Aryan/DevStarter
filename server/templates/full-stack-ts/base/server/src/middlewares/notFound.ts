import type { Request, Response, NextFunction } from 'express';
import { fail, type ApiResponse } from '../utils/response';

export function notFound(_req: Request, res: Response<ApiResponse<never>>, _next: NextFunction) {
  return fail(res, 'Route not found', 404);
}
