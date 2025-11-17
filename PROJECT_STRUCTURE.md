# 项目结构

完整的项目文件结构说明。

```
Todo2/
├── backend/                              # 后端项目目录
│   ├── prisma/
│   │   └── schema.prisma                 # Prisma 数据库模型定义
│   ├── src/
│   │   ├── controllers/                  # 控制器层 - 处理 HTTP 请求
│   │   │   ├── authController.ts         # 认证控制器
│   │   │   ├── todoController.ts         # Todo 控制器
│   │   │   └── groupController.ts        # 分组控制器
│   │   ├── services/                     # 服务层 - 业务逻辑
│   │   │   ├── authService.ts            # 认证服务
│   │   │   ├── todoService.ts            # Todo 服务
│   │   │   └── groupService.ts           # 分组服务
│   │   ├── routes/                       # 路由层 - API 路由定义
│   │   │   ├── authRoutes.ts             # 认证路由
│   │   │   ├── todoRoutes.ts             # Todo 路由
│   │   │   └── groupRoutes.ts            # 分组路由
│   │   ├── middlewares/                  # 中间件
│   │   │   ├── auth.ts                   # JWT 认证中间件
│   │   │   └── errorHandler.ts           # 错误处理中间件
│   │   ├── types/                        # TypeScript 类型定义
│   │   │   └── index.ts                  # 通用类型定义
│   │   ├── utils/                        # 工具函数
│   │   │   ├── logger.ts                 # Winston 日志工具
│   │   │   ├── response.ts               # API 响应工具
│   │   │   ├── jwt.ts                    # JWT 工具
│   │   │   └── validation.ts             # Zod 验证规则
│   │   └── index.ts                      # 应用入口文件
│   ├── logs/                             # 日志目录（自动创建）
│   ├── .env                              # 环境变量（需手动创建）
│   ├── .env.example                      # 环境变量示例
│   ├── .gitignore                        # Git 忽略文件
│   ├── package.json                      # 后端依赖配置
│   └── tsconfig.json                     # TypeScript 配置（strict 模式）
│
├── frontend/                             # 前端项目目录
│   ├── src/
│   │   ├── pages/                        # 页面逻辑（Alpine.js 组件）
│   │   │   ├── login.ts                  # 登录页面逻辑
│   │   │   ├── register.ts               # 注册页面逻辑
│   │   │   └── todos.ts                  # Todo 主页面逻辑
│   │   ├── utils/                        # 工具函数
│   │   │   ├── api.ts                    # API 调用封装
│   │   │   ├── auth.ts                   # 认证工具
│   │   │   └── helpers.ts                # 通用辅助函数
│   │   ├── types.ts                      # TypeScript 类型定义
│   │   └── style.css                     # TailwindCSS 全局样式
│   ├── login.html                        # 登录页面
│   ├── register.html                     # 注册页面
│   ├── todos.html                        # Todo 主应用页面
│   ├── .gitignore                        # Git 忽略文件
│   ├── package.json                      # 前端依赖配置
│   ├── tsconfig.json                     # TypeScript 配置（strict 模式）
│   ├── vite.config.ts                    # Vite 构建配置
│   ├── tailwind.config.js                # TailwindCSS 配置
│   └── postcss.config.js                 # PostCSS 配置
│
├── deploy.sh                             # 一键部署脚本（Ubuntu 20+）
├── start-backend.sh                      # 后端启动脚本
├── start-frontend.sh                     # 前端启动脚本
├── pm2.config.js                         # PM2 进程管理配置
├── .gitignore                            # 项目根 Git 忽略文件
├── README.md                             # 项目说明文档
└── PROJECT_STRUCTURE.md                  # 本文件 - 项目结构说明
```

## 文件说明

### 后端核心文件

#### `prisma/schema.prisma`
- 数据库模型定义
- 包含 User、Todo、Group、RefreshToken 模型
- 定义数据表关系和字段约束

#### `src/index.ts`
- Express 应用入口
- 配置中间件、路由、错误处理
- 启动 HTTP 服务器

#### `src/controllers/*`
- HTTP 请求处理层
- 调用 service 层处理业务逻辑
- 返回统一格式的 API 响应

#### `src/services/*`
- 业务逻辑层
- 数据库操作
- 业务规则验证

#### `src/middlewares/auth.ts`
- JWT Token 验证
- 提取用户信息到 `req.user`

#### `src/utils/jwt.ts`
- JWT Token 生成和验证
- Access Token（15分钟）
- Refresh Token（7天）

#### `src/utils/validation.ts`
- Zod schema 定义
- 请求数据验证规则

### 前端核心文件

#### `src/pages/*.ts`
- Alpine.js 组件逻辑
- 页面状态管理
- 事件处理

#### `src/utils/api.ts`
- Axios 封装
- API 调用方法
- Token 自动刷新拦截器

#### `src/utils/auth.ts`
- LocalStorage Token 管理
- 登录状态检查
- 认证跳转

#### `*.html`
- 页面结构
- TailwindCSS 样式类
- Alpine.js 指令

### 部署文件

#### `deploy.sh`
- 一键部署脚本
- 检查环境
- 安装依赖
- 构建项目
- 启动服务（PM2）

#### `pm2.config.js`
- PM2 配置
- 前后端进程管理
- 日志配置
- 自动重启策略

## 配置文件

### TypeScript 配置
- **后端**: `backend/tsconfig.json` - strict 模式
- **前端**: `frontend/tsconfig.json` - strict 模式

### 构建工具
- **前端**: Vite - 快速构建和热更新
- **后端**: tsc - TypeScript 编译

### 样式工具
- **TailwindCSS**: 实用优先的 CSS 框架
- **PostCSS**: CSS 处理工具

## 数据流向

### 认证流程
```
用户输入 → 前端验证 → API 请求 → 后端验证 → 
数据库查询 → bcrypt 验证 → JWT 生成 → 
Token 存储 → 后续请求携带 Token → JWT 验证 → 访问资源
```

### 数据操作流程
```
用户操作 → Alpine.js 组件 → API 调用 → 
axios 拦截器（添加 Token）→ Express 路由 → 
认证中间件 → 控制器 → 服务层 → Prisma → 
SQLite → 返回数据 → 统一响应格式 → 前端更新
```

## 技术特点

### 后端
- ✅ TypeScript Strict 模式
- ✅ 分层架构（Controller → Service → Model）
- ✅ JWT 双 Token 机制
- ✅ Prisma ORM（类型安全）
- ✅ Zod 输入验证
- ✅ Winston 日志记录
- ✅ 错误统一处理

### 前端
- ✅ TypeScript Strict 模式
- ✅ Alpine.js 轻量级交互
- ✅ TailwindCSS 响应式设计
- ✅ Axios 拦截器（Token 刷新）
- ✅ 模块化架构
- ✅ Vite 快速构建

### 部署
- ✅ PM2 进程管理
- ✅ 一键部署脚本
- ✅ 日志分离
- ✅ 自动重启
- ✅ 开机自启（可选）

