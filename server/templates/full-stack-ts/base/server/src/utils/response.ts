import type { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export class HttpError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function ok<T>(res: Response<ApiResponse<T>>, message: string, data?: T, statusCode = 200) {
  const payload: ApiResponse<T> = data === undefined ? { success: true, message } : { success: true, message, data };
  return res.status(statusCode).json(payload);
}

export function fail<T>(res: Response<ApiResponse<T>>, message: string, statusCode = 400) {
  const payload: ApiResponse<T> = { success: false, message };
  return res.status(statusCode).json(payload);
}
