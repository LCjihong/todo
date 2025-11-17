/**
 * 分组控制器
 * 处理分组相关的 HTTP 请求
 */

import { Response } from 'express';
import { AuthRequest } from '../types';
import * as groupService from '../services/groupService';
import { success, error } from '../utils/response';
import { createGroupSchema, updateGroupSchema } from '../utils/validation';
import logger from '../utils/logger';

/**
 * 获取所有分组
 */
export const getGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      error(res, '未授权', 1, 401);
      return;
    }

    const groups = await groupService.getGroups(userId);

    success(res, groups);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '获取分组失败';
    logger.error('获取分组错误:', err);
    error(res, errorMessage);
  }
};

/**
 * 创建分组
 */
export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      error(res, '未授权', 1, 401);
      return;
    }

    // 验证请求数据
    const validatedData = createGroupSchema.parse(req.body);

    const group = await groupService.createGroup(userId, validatedData);

    success(res, group, '分组创建成功');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '创建分组失败';
    logger.error('创建分组错误:', err);
    error(res, errorMessage);
  }
};

/**
 * 更新分组
 */
export const updateGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      error(res, '未授权', 1, 401);
      return;
    }

    const groupId = parseInt(req.params.id);
    if (isNaN(groupId)) {
      error(res, '无效的分组 ID');
      return;
    }

    // 验证请求数据
    const validatedData = updateGroupSchema.parse(req.body);

    const group = await groupService.updateGroup(userId, groupId, validatedData);

    success(res, group, '分组更新成功');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '更新分组失败';
    logger.error('更新分组错误:', err);
    error(res, errorMessage);
  }
};

/**
 * 删除分组
 */
export const deleteGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      error(res, '未授权', 1, 401);
      return;
    }

    const groupId = parseInt(req.params.id);
    if (isNaN(groupId)) {
      error(res, '无效的分组 ID');
      return;
    }

    const result = await groupService.deleteGroup(userId, groupId);

    success(res, result, '分组删除成功');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '删除分组失败';
    logger.error('删除分组错误:', err);
    error(res, errorMessage);
  }
};

