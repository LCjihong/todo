# Todo 应用

一个功能完整的 Todo 应用，采用前后端分离架构，支持用户认证、任务管理和分组功能。

## 📋 技术栈

### 后端
- **Node.js 24** - 运行时环境
- **Express** - Web 框架
- **TypeScript (Strict)** - 类型安全
- **Prisma ORM** - 数据库 ORM
- **SQLite** - 数据库
- **JWT** - 身份认证（Access Token + Refresh Token）
- **bcrypt** - 密码加密
- **winston** - 日志记录
- **zod** - 输入验证

### 前端
- **Vite** - 构建工具
- **TypeScript (Strict)** - 类型安全
- **TailwindCSS** - 样式框架
- **Alpine.js** - 轻量级前端框架
- **Axios** - HTTP 客户端

## 🚀 快速开始

### 前置要求
- Node.js 18+ (推荐 24)
- npm 或 yarn
- Ubuntu 20+ (用于生产部署)

### 开发环境

#### 1. 克隆项目
```bash
git clone <repository-url>
cd Todo2
```

#### 2. 后端设置
```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库和 JWT 密钥

# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev

# 启动开发服务器
npm run dev
```

后端将在 `http://localhost:3000` 运行

#### 3. 前端设置
```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将在 `http://localhost:5173` 运行

### 生产部署

#### 方式一：使用一键部署脚本（推荐）

```bash
# 给脚本添加执行权限
chmod +x deploy.sh

# 运行部署脚本（需要 sudo）
sudo ./deploy.sh
```

部署脚本将自动完成以下操作：
1. 检查 Node.js 环境
2. 安装 PM2（如果未安装）
3. 安装后端依赖并构建
4. 运行数据库迁移
5. 安装前端依赖并构建
6. 使用 PM2 启动服务
7. 配置 PM2 开机自启

#### 方式二：使用 PM2 配置文件

```bash
# 1. 构建后端
cd backend
npm install
npm run build
npx prisma generate
npx prisma migrate deploy

# 2. 构建前端
cd ../frontend
npm install
npm run build

# 3. 使用 PM2 启动
cd ..
pm2 start pm2.config.js
pm2 save
pm2 startup
```

#### 方式三：手动启动

```bash
# 后端
cd backend
chmod +x ../start-backend.sh
../start-backend.sh

# 前端（新终端）
cd frontend
chmod +x ../start-frontend.sh
../start-frontend.sh
```

## 📁 项目结构

```
Todo2/
├── backend/                 # 后端项目
│   ├── prisma/
│   │   └── schema.prisma   # 数据库模型
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── services/       # 业务逻辑
│   │   ├── routes/         # 路由
│   │   ├── middlewares/    # 中间件
│   │   ├── types/          # TypeScript 类型
│   │   ├── utils/          # 工具函数
│   │   └── index.ts        # 入口文件
│   ├── .env.example        # 环境变量示例
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── pages/          # 页面逻辑
│   │   ├── utils/          # 工具函数
│   │   ├── types.ts        # TypeScript 类型
│   │   └── style.css       # 全局样式
│   ├── login.html          # 登录页面
│   ├── register.html       # 注册页面
│   ├── todos.html          # 主应用页面
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── deploy.sh               # 一键部署脚本
├── start-backend.sh        # 后端启动脚本
├── start-frontend.sh       # 前端启动脚本
├── pm2.config.js           # PM2 配置
└── README.md
```

## 🔐 认证机制

- **Access Token**: 15 分钟有效期，用于 API 请求认证
- **Refresh Token**: 7 天有效期，存储在数据库中，用于刷新 Access Token
- Token 自动刷新机制：当 Access Token 过期时，前端自动使用 Refresh Token 获取新的 Access Token

## 📊 数据库模型

### User（用户）
- id: 主键
- username: 用户名（唯一）
- password: 密码（bcrypt 加密）
- refreshTokens: Refresh Token 列表
- todos: Todo 列表
- groups: 分组列表

### Todo（待办事项）
- id: 主键
- title: 标题
- description: 描述（可选）
- completed: 完成状态
- priority: 优先级（LOW/MEDIUM/HIGH）
- groupId: 所属分组（可选）
- userId: 所属用户

### Group（分组）
- id: 主键
- name: 分组名称
- color: 颜色（可选）
- userId: 所属用户
- todos: 该分组下的 Todo 列表

### RefreshToken（刷新令牌）
- id: 主键
- token: Token 字符串（唯一）
- expiresAt: 过期时间
- userId: 所属用户

## 🔌 API 接口

### 认证 API
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh-token` - 刷新 Access Token
- `POST /api/auth/reset-password` - 重置密码（需认证）

### Todo API
- `GET /api/todos` - 获取所有 Todos（支持排序）
- `POST /api/todos` - 创建 Todo
- `PUT /api/todos/:id` - 更新 Todo
- `DELETE /api/todos/:id` - 删除 Todo
- `PATCH /api/todos/:id/toggle` - 切换完成状态

### Group API
- `GET /api/groups` - 获取所有分组
- `POST /api/groups` - 创建分组
- `PUT /api/groups/:id` - 更新分组
- `DELETE /api/groups/:id` - 删除分组

## 🎨 功能特性

### 用户功能
- ✅ 用户注册和登录
- ✅ JWT 认证（Access Token + Refresh Token）
- ✅ 密码加密存储
- ✅ 密码重置

### Todo 功能
- ✅ 创建、编辑、删除 Todo
- ✅ 标记 Todo 为完成/未完成
- ✅ 优先级设置（低/中/高）
- ✅ 添加描述信息
- ✅ 多种排序方式（创建时间、更新时间、优先级、完成状态）

### 分组功能
- ✅ 创建、编辑、删除分组
- ✅ 自定义分组颜色
- ✅ 按分组过滤 Todo
- ✅ 分组统计

### UI/UX
- ✅ 响应式设计（手机/平板/桌面）
- ✅ 现代化界面
- ✅ 实时通知提示
- ✅ 流畅的交互动画

## 🛠️ 常用命令

### 开发
```bash
# 后端开发
cd backend
npm run dev

# 前端开发
cd frontend
npm run dev

# 数据库管理
cd backend
npx prisma studio         # 打开数据库管理界面
npx prisma migrate dev    # 创建新的迁移
```

### 生产
```bash
# PM2 管理
pm2 list                  # 查看所有进程
pm2 logs                  # 查看日志
pm2 restart all           # 重启所有服务
pm2 stop all              # 停止所有服务
pm2 delete all            # 删除所有进程
pm2 monit                 # 监控面板

# 查看特定服务日志
pm2 logs todo-backend
pm2 logs todo-frontend
```

## 🔧 环境变量

### 后端 (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="production"
CORS_ORIGIN="http://localhost:5173"
```

### 前端
创建 `.env` 文件（可选）：
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📝 注意事项

1. **安全性**
   - 生产环境请修改 JWT 密钥
   - 配置适当的 CORS 策略
   - 使用 HTTPS
   - 定期更新依赖包

2. **数据库**
   - SQLite 适合小型应用
   - 大型应用建议使用 PostgreSQL 或 MySQL
   - 定期备份数据库

3. **日志**
   - 日志文件位于 `backend/logs/`
   - 定期清理日志文件

4. **性能**
   - 考虑使用 Nginx 作为反向代理
   - 启用 gzip 压缩
   - 配置 CDN 加速静态资源

## 📄 许可证

ISC

## 👤 作者

JaredJen

