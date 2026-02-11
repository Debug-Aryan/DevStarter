import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken';
import { HttpError } from '../utils/response';
import { createUser, findUserByEmail, toPublicUser, type PublicUser } from './userService';

export interface AuthToken {
  token: string;
  expiresIn: string;
}

export interface AuthResponse {
  user: PublicUser;
  auth: AuthToken;
}

function getJwtExpiresIn() {
  const expiresIn = process.env.JWT_EXPIRES_IN;
  if (!expiresIn) {
    throw new Error('JWT_EXPIRES_IN is missing. Set it in server/.env (see .env.example).');
  }
  return expiresIn;
}

export async function registerUser(input: { email: string; password: string }): Promise<AuthResponse> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new HttpError('Email already in use', 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await createUser({ email: input.email, passwordHash });
  const token = generateToken(String(user._id));

  return {
    user: toPublicUser(user),
    auth: { token, expiresIn: getJwtExpiresIn() },
  };
}

export async function loginUser(input: { email: string; password: string }): Promise<AuthResponse> {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new HttpError('Invalid email or password', 401);
  }

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) {
    throw new HttpError('Invalid email or password', 401);
  }

  const token = generateToken(String(user._id));
  return {
    user: toPublicUser(user),
    auth: { token, expiresIn: getJwtExpiresIn() },
  };
}
