import { User } from '../models/User';

export interface PublicUser {
  id: string;
  email: string;
  createdAt: string;
}

export function toPublicUser(user: { _id: unknown; email: string; createdAt: Date }): PublicUser {
  return {
    id: String(user._id),
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function findUserByEmail(email: string) {
  return User.findOne({ email }).exec();
}

export async function findUserById(id: string) {
  return User.findById(id).exec();
}

export async function createUser(input: { email: string; passwordHash: string }) {
  const user = await User.create(input);
  return user;
}
