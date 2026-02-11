import jwt from 'jsonwebtoken';

export interface AccessTokenPayload {
  sub: string;
}

export function generateToken(userId: string) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secret) {
    throw new Error('JWT_SECRET is missing. Set it in server/.env (see .env.example).');
  }

  if (!expiresIn) {
    throw new Error('JWT_EXPIRES_IN is missing. Set it in server/.env (see .env.example).');
  }

  return jwt.sign(
    { sub: userId } satisfies AccessTokenPayload,
    secret,
    // jsonwebtoken types use a narrower string type (StringValue). We validate at runtime by requiring presence,
    // and keep the assertion localized here.
    { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] },
  );
}
