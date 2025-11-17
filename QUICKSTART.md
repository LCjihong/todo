# 🚀 快速入门指南

本指南将帮助您在 5 分钟内运行 Todo 应用。

## 开发环境快速启动

### 步骤 1: 安装依赖

#### 后端
```bash
cd backend
npm install
```

#### 前端
```bash
cd frontend
npm install
```

### 步骤 2: 配置环境变量

```bash
cd backend

# 复制环境变量示例文件
cp .env.example .env

# 环境变量已包含默认配置，可直接使用
# 如需修改，请编辑 .env 文件
```

### 步骤 3: 初始化数据库

```bash
cd backend

# 生成 Prisma Client
npx prisma generate

# 创建数据库和表
npx prisma migrate dev
```

### 步骤 4: 启动开发服务器

打开两个终端窗口：

**终端 1 - 后端:**
```bash
cd backend
npm run dev
```
后端将运行在 `http://localhost:3000`

**终端 2 - 前端:**
```bash
cd frontend
npm run dev
```
前端将运行在 `http://localhost:5173`

### 步骤 5: 访问应用

打开浏览器访问 `http://localhost:5173`

1. 首先注册一个新账户
2. 登录后即可开始使用

## 生产环境快速部署

### 方式 1: 一键部署（推荐）

```bash
# 给脚本添加执行权限
chmod +x deploy.sh

# 运行部署脚本（需要 sudo）
sudo ./deploy.sh
```

部署完成后，应用将自动启动在：
- 前端: `http://localhost:5173`
- 后端: `http://localhost:3000`

### 方式 2: PM2 配置文件

```bash
# 1. 安装依赖并构建
cd backend && npm install && npm run build && npx prisma generate && npx prisma migrate deploy
cd ../frontend && npm install && npm run build

# 2. 返回根目录并使用 PM2 启动
cd ..
pm2 start pm2.config.js
pm2 save
```

## 常见问题

### Q: 后端启动失败？
A: 检查：
1. Node.js 版本是否 >= 18
2. 是否运行了 `npx prisma generate`
3. 是否运行了 `npx prisma migrate dev`
4. 端口 3000 是否被占用

### Q: 前端无法连接后端？
A: 检查：
1. 后端是否正常运行
2. 检查浏览器控制台的错误信息
3. 确认 API 地址配置正确（默认 http://localhost:3000）

### Q: 登录后立即退出？
A: 检查：
1. 浏览器是否允许 LocalStorage
2. JWT 密钥是否配置正确
3. 查看浏览器控制台和后端日志

### Q: 数据库错误？
A: 尝试：
```bash
cd backend
rm -f prisma/dev.db  # 删除旧数据库
npx prisma migrate reset  # 重置数据库
```

## PM2 常用命令

```bash
pm2 list              # 查看所有进程
pm2 logs              # 查看所有日志
pm2 logs todo-backend # 查看后端日志
pm2 logs todo-frontend# 查看前端日志
pm2 restart all       # 重启所有服务
pm2 stop all          # 停止所有服务
pm2 delete all        # 删除所有进程
pm2 monit             # 实时监控
```

## 默认配置

### 端口
- 后端: 3000
- 前端: 5173

### Token 过期时间
- Access Token: 15 分钟
- Refresh Token: 7 天

### 数据库
- 类型: SQLite
- 位置: `backend/dev.db`（开发环境）

## 目录说明

```
backend/          # 后端代码
frontend/         # 前端代码
deploy.sh         # 一键部署脚本
pm2.config.js     # PM2 配置
README.md         # 完整文档
```

## 下一步

- 📖 阅读完整的 [README.md](README.md)
- 🏗️ 查看 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) 了解项目结构
- 🔧 根据需求修改配置
- 🎨 自定义界面样式

## 获取帮助

如遇到问题，请检查：
1. 后端日志: `backend/logs/`
2. PM2 日志: `pm2 logs`
3. 浏览器控制台

祝您使用愉快！🎉

