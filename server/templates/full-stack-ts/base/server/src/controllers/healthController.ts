import type { Request, Response } from 'express';
import { ok, type ApiResponse } from '../utils/response';

interface HealthData {
  status: 'ok';
  timestamp: string;
}

export function getHealth(_req: Request, res: Response<ApiResponse<HealthData>>) {
  return ok(res, 'Server healthy', { status: 'ok', timestamp: new Date().toISOString() });
}
