/**
 * 分组服务
 * 处理分组相关的业务逻辑
 */

import { PrismaClient } from '@prisma/client';
import { CreateGroupRequest, UpdateGroupRequest } from '../types';
import logger from '../utils/logger';

const prisma = new PrismaClient();

/**
 * 获取用户的所有分组
 */
export const getGroups = async (userId: number) => {
  const groups = await prisma.group.findMany({
    where: { userId },
    include: {
      _count: {
        select: { todos: true },
      },
    },
  });

  return groups;
};

/**
 * 创建分组
 */
export const createGroup = async (userId: number, data: CreateGroupRequest) => {
  const group = await prisma.group.create({
    data: {
      name: data.name,
      color: data.color,
      userId,
    },
  });

  logger.info(`用户 ${userId} 创建了分组: ${group.name}`);

  return group;
};

/**
 * 更新分组
 */
export const updateGroup = async (userId: number, groupId: number, data: UpdateGroupRequest) => {
  // 验证分组是否存在且属于该用户
  const existingGroup = await prisma.group.findFirst({
    where: {
      id: groupId,
      userId,
    },
  });

  if (!existingGroup) {
    throw new Error('分组不存在或无权访问');
  }

  const group = await prisma.group.update({
    where: { id: groupId },
    data,
  });

  logger.info(`用户 ${userId} 更新了分组: ${group.name}`);

  return group;
};

/**
 * 删除分组
 */
export const deleteGroup = async (userId: number, groupId: number) => {
  // 验证分组是否存在且属于该用户
  const existingGroup = await prisma.group.findFirst({
    where: {
      id: groupId,
      userId,
    },
  });

  if (!existingGroup) {
    throw new Error('分组不存在或无权访问');
  }

  // 删除分组（关联的 todos 的 groupId 会被设置为 null）
  await prisma.group.delete({
    where: { id: groupId },
  });

  logger.info(`用户 ${userId} 删除了分组: ${existingGroup.name}`);

  return { message: '删除成功' };
};

