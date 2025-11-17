/**
 * 全局错误处理中间件
 * 捕获所有未处理的错误并返回统一的错误响应
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { serverError } from '../utils/response';

/**
 * 全局错误处理器
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 记录错误日志
  logger.error('未捕获的错误:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // 返回错误响应
  serverError(res, process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message);
};

/**
 * 404 Not Found 处理器
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    code: 404,
    message: `路由 ${req.method} ${req.path} 不存在`,
  });
};

