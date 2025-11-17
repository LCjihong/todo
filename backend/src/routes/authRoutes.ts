/**
 * 认证路由
 * 定义认证相关的 API 路由
 */

import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// 注册
router.post('/register', authController.register);

// 登录
router.post('/login', authController.login);

// 刷新 Token
router.post('/refresh-token', authController.refreshToken);

// 重置密码（需要认证）
router.post('/reset-password', authenticate, authController.resetPassword);

export default router;

