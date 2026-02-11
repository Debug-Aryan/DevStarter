import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { fail, type ApiResponse } from '../utils/response';
import type { AccessTokenPayload } from '../utils/generateToken';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

function getBearerToken(req: Request) {
  const header = req.header('authorization');
  if (!header) return null;

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

export function authMiddleware(req: Request, res: Response<ApiResponse<never>>, next: NextFunction) {
  const token = getBearerToken(req);
  if (!token) {
    return fail(res, 'Unauthorized', 401);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return fail(res, 'Server misconfigured: missing JWT_SECRET', 500);
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded !== 'object' || decoded === null || !('sub' in decoded)) {
      return fail(res, 'Unauthorized', 401);
    }

    const payload = decoded as AccessTokenPayload;
    if (!payload.sub) {
      return fail(res, 'Unauthorized', 401);
    }

    req.user = { id: payload.sub };
    return next();
  } catch {
    return fail(res, 'Unauthorized', 401);
  }
}
