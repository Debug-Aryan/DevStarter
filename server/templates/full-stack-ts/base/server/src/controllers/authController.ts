import type { Request, Response, NextFunction } from 'express';
import { loginUser, registerUser, type AuthResponse } from '../services/authService';
import { findUserById, toPublicUser } from '../services/userService';
import { ok, type ApiResponse, fail } from '../utils/response';

interface RegisterBody {
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export async function register(
  req: Request<{}, ApiResponse<AuthResponse>, RegisterBody>,
  res: Response<ApiResponse<AuthResponse>>,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return fail(res, 'Email and password are required', 400);
    }

    if (password.length < 8) {
      return fail(res, 'Password must be at least 8 characters', 400);
    }

    const data = await registerUser({ email, password });
    return ok(res, 'Registered successfully', data, 201);
  } catch (err) {
    return next(err);
  }
}

export async function login(
  req: Request<{}, ApiResponse<AuthResponse>, LoginBody>,
  res: Response<ApiResponse<AuthResponse>>,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return fail(res, 'Email and password are required', 400);
    }

    const data = await loginUser({ email, password });
    return ok(res, 'Logged in successfully', data);
  } catch (err) {
    return next(err);
  }
}

export async function me(
  req: Request,
  res: Response<ApiResponse<ReturnType<typeof toPublicUser>>>,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      return fail(res, 'Unauthorized', 401);
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      return fail(res, 'User not found', 404);
    }

    return ok(res, 'Authenticated', toPublicUser(user));
  } catch (err) {
    return next(err);
  }
}
