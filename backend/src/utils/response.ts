/**
 * API 响应工具函数
 * 提供统一的响应格式
 */

import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * 成功响应
 */
export const success = <T>(res: Response, data?: T, message: string = 'success'): void => {
  const response: ApiResponse<T> = {
    code: 0,
    message,
    data,
  };
  res.json(response);
};

/**
 * 错误响应
 */
export const error = (
  res: Response, 
  message: string = 'error', 
  code: number = 1, 
  statusCode: number = 400
): void => {
  const response: ApiResponse = {
    code,
    message,
  };
  res.status(statusCode).json(response);
};

/**
 * 未授权响应
 */
export const unauthorized = (res: Response, message: string = 'Unauthorized'): void => {
  error(res, message, 401, 401);
};

/**
 * 禁止访问响应
 */
export const forbidden = (res: Response, message: string = 'Forbidden'): void => {
  error(res, message, 403, 403);
};

/**
 * 未找到响应
 */
export const notFound = (res: Response, message: string = 'Not Found'): void => {
  error(res, message, 404, 404);
};

/**
 * 服务器错误响应
 */
export const serverError = (res: Response, message: string = 'Internal Server Error'): void => {
  error(res, message, 500, 500);
};

