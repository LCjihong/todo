/**
 * 认证服务
 * 处理用户注册、登录、Token 刷新等业务逻辑
 */

import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, getRefreshTokenExpiration } from '../utils/jwt';
import { TokenPayload, LoginRequest, RegisterRequest } from '../types';
import logger from '../utils/logger';

const prisma = new PrismaClient();

/**
 * 用户注册
 */
export const register = async (data: RegisterRequest) => {
  const { username, password } = data;

  // 检查用户名是否已存在
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new Error('用户名已存在');
  }

  // 加密密码（从环境变量读取轮数，默认 10）
  const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
  const hashedPassword = await bcrypt.hash(password, bcryptRounds);

  // 创建用户
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  logger.info(`新用户注册: ${username}`);

  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  };
};

/**
 * 用户登录
 */
export const login = async (data: LoginRequest) => {
  const { username, password } = data;

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error('用户名或密码错误');
  }

  // 验证密码
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('用户名或密码错误');
  }

  // 生成 Token
  const payload: TokenPayload = {
    userId: user.id,
    username: user.username,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // 保存 Refresh Token 到数据库
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiration(),
    },
  });

  logger.info(`用户登录: ${username}`);

  return {
    user: {
      id: user.id,
      username: user.username,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * 刷新 Access Token
 */
export const refreshAccessToken = async (refreshToken: string) => {
  // 验证 Refresh Token
  const payload = verifyRefreshToken(refreshToken);

  if (!payload) {
    throw new Error('Refresh Token 无效或已过期');
  }

  // 检查 Refresh Token 是否在数据库中
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw new Error('Refresh Token 不存在');
  }

  // 检查是否过期
  if (storedToken.expiresAt < new Date()) {
    // 删除过期的 Token
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
    throw new Error('Refresh Token 已过期');
  }

  // 生成新的 Access Token
  const newAccessToken = generateAccessToken({
    userId: storedToken.user.id,
    username: storedToken.user.username,
  });

  logger.info(`Token 刷新: 用户 ${storedToken.user.username}`);

  return {
    accessToken: newAccessToken,
  };
};

/**
 * 重置密码
 */
export const resetPassword = async (userId: number, oldPassword: string, newPassword: string) => {
  // 获取用户
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('用户不存在');
  }

  // 验证旧密码
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new Error('旧密码错误');
  }

  // 加密新密码（从环境变量读取轮数，默认 10）
  const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
  const hashedPassword = await bcrypt.hash(newPassword, bcryptRounds);

  // 更新密码
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // 删除该用户的所有 Refresh Token（强制重新登录）
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });

  logger.info(`用户 ${user.username} 重置密码`);

  return { message: '密码重置成功，请重新登录' };
};

/**
 * 登出（删除 Refresh Token）
 */
export const logout = async (refreshToken: string) => {
  await prisma.refreshToken.delete({
    where: { token: refreshToken },
  });

  logger.info('用户登出');
};

