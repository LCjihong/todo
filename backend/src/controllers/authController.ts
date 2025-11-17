/**
 * 认证控制器
 * 处理认证相关的 HTTP 请求
 */

import { Response } from 'express';
import { AuthRequest } from '../types';
import * as authService from '../services/authService';
import { success, error } from '../utils/response';
import { 
  registerSchema, 
  loginSchema, 
  refreshTokenSchema, 
  resetPasswordSchema 
} from '../utils/validation';
import logger from '../utils/logger';

/**
 * 用户注册
 */
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 验证请求数据
    const validatedData = registerSchema.parse(req.body);

    // 调用服务层
    const result = await authService.register(validatedData);

    success(res, result, '注册成功');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '注册失败';
    logger.error('注册错误:', err);
    error(res, errorMessage);
  }
};

/**
 * 用户登录
 */
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 验证请求数据
    const validatedData = loginSchema.parse(req.body);

    // 调用服务层
    const result = await authService.login(validatedData);

    success(res, result, '登录成功');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '登录失败';
    logger.error('登录错误:', err);
    error(res, errorMessage);
  }
};

/**
 * 刷新 Access Token
 */
export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 验证请求数据
    const validatedData = refreshTokenSchema.parse(req.body);

    // 调用服务层
    const result = await authService.refreshAccessToken(validatedData.refreshToken);

    success(res, result, 'Token 刷新成功');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Token 刷新失败';
    logger.error('Token 刷新错误:', err);
    error(res, errorMessage, 1, 401);
  }
};

/**
 * 重置密码
 */
export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 验证请求数据
    const validatedData = resetPasswordSchema.parse(req.body);

    // 获取当前用户 ID
    const userId = req.user?.userId;
    if (!userId) {
      error(res, '未授权', 1, 401);
      return;
    }

    // 调用服务层
    const result = await authService.resetPassword(
      userId,
      validatedData.oldPassword,
      validatedData.newPassword
    );

    success(res, result, '密码重置成功');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '密码重置失败';
    logger.error('密码重置错误:', err);
    error(res, errorMessage);
  }
};

