export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthToken {
  token: string;
  expiresIn: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthPayload {
  user: AuthUser;
  auth: AuthToken;
}
