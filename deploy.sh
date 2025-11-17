#!/bin/bash

###############################################################################
# Todo 应用一键部署脚本
# 适用于 Ubuntu 20+ 和 Node.js 24 环境
# 
# 使用方法:
#   chmod +x deploy.sh
#   ./deploy.sh
###############################################################################

set -e  # 遇到错误立即退出

echo "=================================================="
echo "Todo 应用一键部署脚本"
echo "=================================================="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
  echo "⚠️  请使用 sudo 运行此脚本"
  exit 1
fi

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
  echo -e "${YELLOW}ℹ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# 获取当前目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

print_info "项目目录: $SCRIPT_DIR"
echo ""

# 1. 检查 Node.js 版本
echo "1. 检查 Node.js 版本..."
if ! command -v node &> /dev/null; then
  print_error "Node.js 未安装，请先安装 Node.js 24"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  print_error "Node.js 版本过低 (当前: v$NODE_VERSION)，请安装 Node.js 18 或更高版本"
  exit 1
fi

print_success "Node.js 版本: $(node -v)"
echo ""

# 2. 安装 PM2（如果未安装）
echo "2. 检查 PM2..."
if ! command -v pm2 &> /dev/null; then
  print_info "PM2 未安装，正在安装..."
  npm install -g pm2
  print_success "PM2 安装完成"
else
  print_success "PM2 已安装: $(pm2 -v)"
fi
echo ""

# 3. 后端部署
echo "3. 部署后端..."
cd "$BACKEND_DIR"

print_info "安装后端依赖..."
npm install

print_info "配置环境变量..."
if [ ! -f .env ]; then
  cp .env.example .env 2>/dev/null || cat > .env <<EOF
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET="$(openssl rand -base64 32)"
JWT_REFRESH_SECRET="$(openssl rand -base64 32)"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="production"
CORS_ORIGIN="http://localhost:5173"
EOF
  print_success "环境变量文件已创建"
else
  print_success "环境变量文件已存在"
fi

print_info "生成 Prisma Client..."
npx prisma generate

print_info "运行数据库迁移..."
npx prisma migrate deploy || npx prisma db push

print_info "编译 TypeScript..."
npm run build

print_success "后端部署完成"
echo ""

# 4. 前端部署
echo "4. 部署前端..."
cd "$FRONTEND_DIR"

print_info "安装前端依赖..."
npm install

print_info "构建前端..."
npm run build

print_success "前端部署完成"
echo ""

# 5. 启动服务
echo "5. 启动服务..."

cd "$BACKEND_DIR"

# 停止旧的 PM2 进程（如果存在）
pm2 delete todo-backend 2>/dev/null || true

# 启动后端
print_info "启动后端服务..."
pm2 start dist/index.js --name todo-backend --log logs/pm2.log

# 设置 PM2 开机自启
pm2 save
pm2 startup | tail -1 | bash || true

print_success "服务启动完成"
echo ""

# 6. 前端服务（使用 serve）
echo "6. 配置前端服务..."

# 安装 serve（如果未安装）
if ! command -v serve &> /dev/null; then
  print_info "安装 serve..."
  npm install -g serve
fi

cd "$FRONTEND_DIR"

# 停止旧的前端服务
pm2 delete todo-frontend 2>/dev/null || true

# 启动前端服务
print_info "启动前端服务..."
pm2 start "$(which serve)" --name todo-frontend -- dist -l 5173

pm2 save

print_success "前端服务启动完成"
echo ""

# 7. 显示状态
echo "7. 服务状态:"
pm2 list
echo ""

# 8. 完成
echo "=================================================="
print_success "部署完成！"
echo "=================================================="
echo ""
echo "访问地址："
echo "  - 前端: http://localhost:5173"
echo "  - 后端: http://localhost:3000"
echo ""
echo "常用命令："
echo "  - 查看日志: pm2 logs"
echo "  - 重启服务: pm2 restart all"
echo "  - 停止服务: pm2 stop all"
echo "  - 查看状态: pm2 status"
echo ""
echo "注意：如果需要外网访问，请配置防火墙和 Nginx 反向代理"
echo ""

