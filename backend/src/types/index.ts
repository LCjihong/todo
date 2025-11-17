/**
 * TypeScript 类型定义文件
 * 定义应用中使用的所有类型接口
 */

import { Request } from 'express';

// 优先级类型（SQLite 不支持枚举，使用字符串字面量类型）
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

// 扩展 Express Request 接口，添加用户信息
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

// API 统一响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 注册请求
export interface RegisterRequest {
  username: string;
  password: string;
}

// 刷新 Token 请求
export interface RefreshTokenRequest {
  refreshToken: string;
}

// 重置密码请求
export interface ResetPasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// 创建 Todo 请求
export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: Priority;
  groupId?: number;
}

// 更新 Todo 请求
export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  groupId?: number | null;
}

// 创建分组请求
export interface CreateGroupRequest {
  name: string;
  color?: string;
}

// 更新分组请求
export interface UpdateGroupRequest {
  name?: string;
  color?: string;
}

// Token 载荷
export interface TokenPayload {
  userId: number;
  username: string;
}

// 排序参数
export interface SortParams {
  field?: 'createdAt' | 'updatedAt' | 'completed' | 'priority';
  order?: 'asc' | 'desc';
}

