/**
 * Todo 控制器
 * 处理 Todo 相关的 HTTP 请求
 */

import { Response } from 'express';
import { AuthRequest, SortParams } from '../types';
import * as todoService from '../services/todoService';
import { success, error } from '../utils/response';
import { createTodoSchema, updateTodoSchema } from '../utils/validation';
import logger from '../utils/logger';

/**
 * 获取所有 Todos
 */
export const getTodos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      error(res, '未授权', 1, 401);
      return;
    }

    // 获取排序参数
    const sortParams: SortParams = {
      field: req.query.sortField as SortParams['field'],
      order: req.query.sortOrder as SortParams['order'],
    };

    const todos = await todoService.getTodos(userId, sortParams);

    success(res, todos);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '获取 Todos 失败';
    logger.error('获取 Todos 错误:', err);
    error(res, errorMessage);
  }
};

/**
 * 创建 Todo
 */
export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      error(res, '未授权', 1, 401);
      return;
    }

    // 验证请求数据
    const validatedData = createTodoSchema.parse(req.body);

    const todo = await todoService.createTodo(userId, validatedData);

    success(res, todo, 'Todo 创建成功');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '创建 Todo 失败';
    logger.error('创建 Todo 错误:', err);
    error(res, errorMessage);
  }
};

/**
 * 更新 Todo
 */
export const updateTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      error(res, '未授权', 1, 401);
      return;
    }

    const todoId = parseInt(req.params.id);
    if (isNaN(todoId)) {
      error(res, '无效的 Todo ID');
      return;
    }

    // 验证请求数据
    const validatedData = updateTodoSchema.parse(req.body);

    const todo = await todoService.updateTodo(userId, todoId, validatedData);

    success(res, todo, 'Todo 更新成功');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '更新 Todo 失败';
    logger.error('更新 Todo 错误:', err);
    error(res, errorMessage);
  }
};

/**
 * 删除 Todo
 */
export const deleteTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      error(res, '未授权', 1, 401);
      return;
    }

    const todoId = parseInt(req.params.id);
    if (isNaN(todoId)) {
      error(res, '无效的 Todo ID');
      return;
    }

    const result = await todoService.deleteTodo(userId, todoId);

    success(res, result, 'Todo 删除成功');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '删除 Todo 失败';
    logger.error('删除 Todo 错误:', err);
    error(res, errorMessage);
  }
};

/**
 * 切换 Todo 完成状态
 */
export const toggleTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      error(res, '未授权', 1, 401);
      return;
    }

    const todoId = parseInt(req.params.id);
    if (isNaN(todoId)) {
      error(res, '无效的 Todo ID');
      return;
    }

    const todo = await todoService.toggleTodoStatus(userId, todoId);

    success(res, todo, '状态切换成功');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '切换状态失败';
    logger.error('切换 Todo 状态错误:', err);
    error(res, errorMessage);
  }
};

