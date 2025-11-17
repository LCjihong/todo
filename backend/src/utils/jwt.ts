/**
 * JWT 工具函数
 * 负责生成和验证 JWT Token
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import { TokenPayload } from '../types';

// 获取环境变量
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * 生成 Access Token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  } as SignOptions);
};

/**
 * 生成 Refresh Token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as SignOptions);
};

/**
 * 验证 Access Token
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * 验证 Refresh Token
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * 获取 Refresh Token 过期时间（7天后）
 */
export const getRefreshTokenExpiration = (): Date => {
  const expirationTime = 7 * 24 * 60 * 60 * 1000; // 7 天（毫秒）
  return new Date(Date.now() + expirationTime);
};

