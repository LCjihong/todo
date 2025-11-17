/**
 * 认证中间件
 * 验证 JWT Token 并提取用户信息
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt';
import { unauthorized } from '../utils/response';
import logger from '../utils/logger';

/**
 * JWT 认证中间件
 * 验证请求头中的 Authorization Token
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 获取 Authorization 头
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      unauthorized(res, '未提供认证令牌');
      return;
    }

    // 提取 Token
    const token = authHeader.substring(7); // 移除 "Bearer " 前缀

    // 验证 Token
    const payload = verifyAccessToken(token);

    if (!payload) {
      unauthorized(res, '认证令牌无效或已过期');
      return;
    }

    // 将用户信息附加到 request 对象
    req.user = {
      userId: payload.userId,
      username: payload.username,
    };

    next();
  } catch (error) {
    logger.error('认证中间件错误:', error);
    unauthorized(res, '认证失败');
  }
};

