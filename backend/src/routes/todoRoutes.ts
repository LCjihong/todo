/**
 * Todo 路由
 * 定义 Todo 相关的 API 路由
 */

import { Router } from 'express';
import * as todoController from '../controllers/todoController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// 所有 Todo 路由都需要认证
router.use(authenticate);

// 获取所有 Todos
router.get('/', todoController.getTodos);

// 创建 Todo
router.post('/', todoController.createTodo);

// 更新 Todo
router.put('/:id', todoController.updateTodo);

// 删除 Todo
router.delete('/:id', todoController.deleteTodo);

// 切换 Todo 完成状态
router.patch('/:id/toggle', todoController.toggleTodo);

export default router;

