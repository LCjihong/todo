/**
 * 应用主入口文件
 * 配置 Express 应用并启动服务器
 */

import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import todoRoutes from './routes/todoRoutes';
import groupRoutes from './routes/groupRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import logger from './utils/logger';

// 加载环境变量
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
    ip: req.ip,
  });
  next();
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/groups', groupRoutes);

// 健康检查
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 处理
app.use(notFoundHandler);

// 错误处理
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  logger.info(`🚀 服务器启动成功，运行在端口 ${PORT}`);
  logger.info(`环境: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

