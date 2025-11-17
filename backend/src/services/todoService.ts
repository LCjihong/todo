/**
 * Todo 服务
 * 处理 Todo 相关的业务逻辑
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { CreateTodoRequest, UpdateTodoRequest, SortParams } from '../types';
import logger from '../utils/logger';

const prisma = new PrismaClient();

/**
 * 获取用户的所有 Todos（支持排序）
 */
export const getTodos = async (userId: number, sort?: SortParams) => {
  // 构建排序参数
  const orderBy: Prisma.TodoOrderByWithRelationInput = {};
  
  if (sort?.field) {
    orderBy[sort.field] = sort.order || 'asc';
  } else {
    // 默认按创建时间倒序
    orderBy.createdAt = 'desc';
  }

  const todos = await prisma.todo.findMany({
    where: { userId },
    include: {
      group: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
    orderBy,
  });

  return todos;
};

/**
 * 创建 Todo
 */
export const createTodo = async (userId: number, data: CreateTodoRequest) => {
  // 如果指定了 groupId，验证该分组是否属于该用户
  if (data.groupId) {
    const group = await prisma.group.findFirst({
      where: {
        id: data.groupId,
        userId,
      },
    });

    if (!group) {
      throw new Error('分组不存在或无权访问');
    }
  }

  const todo = await prisma.todo.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      groupId: data.groupId,
      userId,
    },
    include: {
      group: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });

  logger.info(`用户 ${userId} 创建了 Todo: ${todo.title}`);

  return todo;
};

/**
 * 更新 Todo
 */
export const updateTodo = async (userId: number, todoId: number, data: UpdateTodoRequest) => {
  // 验证 Todo 是否存在且属于该用户
  const existingTodo = await prisma.todo.findFirst({
    where: {
      id: todoId,
      userId,
    },
  });

  if (!existingTodo) {
    throw new Error('Todo 不存在或无权访问');
  }

  // 如果更新了 groupId，验证该分组是否属于该用户
  if (data.groupId !== undefined) {
    if (data.groupId !== null) {
      const group = await prisma.group.findFirst({
        where: {
          id: data.groupId,
          userId,
        },
      });

      if (!group) {
        throw new Error('分组不存在或无权访问');
      }
    }
  }

  const todo = await prisma.todo.update({
    where: { id: todoId },
    data,
    include: {
      group: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });

  logger.info(`用户 ${userId} 更新了 Todo: ${todo.title}`);

  return todo;
};

/**
 * 删除 Todo
 */
export const deleteTodo = async (userId: number, todoId: number) => {
  // 验证 Todo 是否存在且属于该用户
  const existingTodo = await prisma.todo.findFirst({
    where: {
      id: todoId,
      userId,
    },
  });

  if (!existingTodo) {
    throw new Error('Todo 不存在或无权访问');
  }

  await prisma.todo.delete({
    where: { id: todoId },
  });

  logger.info(`用户 ${userId} 删除了 Todo: ${existingTodo.title}`);

  return { message: '删除成功' };
};

/**
 * 切换 Todo 完成状态
 */
export const toggleTodoStatus = async (userId: number, todoId: number) => {
  // 验证 Todo 是否存在且属于该用户
  const existingTodo = await prisma.todo.findFirst({
    where: {
      id: todoId,
      userId,
    },
  });

  if (!existingTodo) {
    throw new Error('Todo 不存在或无权访问');
  }

  const todo = await prisma.todo.update({
    where: { id: todoId },
    data: {
      completed: !existingTodo.completed,
    },
    include: {
      group: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });

  logger.info(`用户 ${userId} 切换了 Todo 状态: ${todo.title} -> ${todo.completed}`);

  return todo;
};

