/**
 * Zod 验证工具
 * 定义所有 API 请求的验证规则
 */

import { z } from 'zod';

// 注册验证规则
export const registerSchema = z.object({
  username: z.string().min(3, '用户名至少 3 个字符').max(20, '用户名最多 20 个字符'),
  password: z.string().min(6, '密码至少 6 个字符').max(50, '密码最多 50 个字符'),
});

// 登录验证规则
export const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
});

// 刷新 Token 验证规则
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh Token 不能为空'),
});

// 重置密码验证规则
export const resetPasswordSchema = z.object({
  oldPassword: z.string().min(1, '旧密码不能为空'),
  newPassword: z.string().min(6, '新密码至少 6 个字符').max(50, '新密码最多 50 个字符'),
});

// 创建 Todo 验证规则
export const createTodoSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题最多 200 个字符'),
  description: z.string().max(1000, '描述最多 1000 个字符').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  groupId: z.number().int().positive().optional(),
});

// 更新 Todo 验证规则
export const updateTodoSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题最多 200 个字符').optional(),
  description: z.string().max(1000, '描述最多 1000 个字符').optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  groupId: z.number().int().positive().nullable().optional(),
});

// 创建分组验证规则
export const createGroupSchema = z.object({
  name: z.string().min(1, '分组名称不能为空').max(50, '分组名称最多 50 个字符'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '颜色格式必须为 #RRGGBB').optional(),
});

// 更新分组验证规则
export const updateGroupSchema = z.object({
  name: z.string().min(1, '分组名称不能为空').max(50, '分组名称最多 50 个字符').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '颜色格式必须为 #RRGGBB').optional(),
});

