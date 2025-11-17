#!/bin/bash

###############################################################################
# 后端启动脚本
###############################################################################

set -e

echo "启动 Todo 应用后端..."

cd "$(dirname "$0")/backend"

# 检查 .env 文件
if [ ! -f .env ]; then
  echo "错误: .env 文件不存在，请先创建"
  exit 1
fi

# 检查 node_modules
if [ ! -d node_modules ]; then
  echo "安装依赖..."
  npm install
fi

# 生成 Prisma Client
echo "生成 Prisma Client..."
npx prisma generate

# 运行数据库迁移
echo "运行数据库迁移..."
npx prisma migrate deploy || npx prisma db push

# 编译 TypeScript
if [ ! -d dist ]; then
  echo "编译 TypeScript..."
  npm run build
fi

# 启动服务
echo "启动服务..."
npm start

