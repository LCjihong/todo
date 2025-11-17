/**
 * 分组路由
 * 定义分组相关的 API 路由
 */

import { Router } from 'express';
import * as groupController from '../controllers/groupController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// 所有分组路由都需要认证
router.use(authenticate);

// 获取所有分组
router.get('/', groupController.getGroups);

// 创建分组
router.post('/', groupController.createGroup);

// 更新分组
router.put('/:id', groupController.updateGroup);

// 删除分组
router.delete('/:id', groupController.deleteGroup);

export default router;

