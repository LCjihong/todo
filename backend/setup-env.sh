#!/bin/bash

###############################################################################
# 环境变量快速配置脚本
# 
# 功能：
# 1. 从 .env.example 创建 .env 文件
# 2. 自动生成 JWT 密钥
# 3. 交互式配置其他选项
###############################################################################

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

echo "=================================================="
echo "Todo 应用环境变量配置脚本"
echo "=================================================="
echo ""

# 检查 .env.example 是否存在
if [ ! -f .env.example ]; then
  print_warning ".env.example 文件不存在，正在创建..."
  # 这里可以添加创建 .env.example 的逻辑
  exit 1
fi

# 检查 .env 是否已存在
if [ -f .env ]; then
  print_warning ".env 文件已存在"
  read -p "是否覆盖现有 .env 文件？(y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "已取消操作"
    exit 0
  fi
  print_info "备份现有 .env 文件..."
  cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
fi

# 从 .env.example 复制
print_info "从 .env.example 创建 .env 文件..."
cp .env.example .env

# 生成 JWT 密钥
print_info "生成 JWT 密钥..."

# 生成 Access Token 密钥
ACCESS_SECRET=$(openssl rand -base64 32)
# 生成 Refresh Token 密钥
REFRESH_SECRET=$(openssl rand -base64 32)

# 替换密钥（macOS 和 Linux 兼容）
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s|JWT_ACCESS_SECRET=.*|JWT_ACCESS_SECRET=\"${ACCESS_SECRET}\"|" .env
  sed -i '' "s|JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=\"${REFRESH_SECRET}\"|" .env
else
  # Linux
  sed -i "s|JWT_ACCESS_SECRET=.*|JWT_ACCESS_SECRET=\"${ACCESS_SECRET}\"|" .env
  sed -i "s|JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=\"${REFRESH_SECRET}\"|" .env
fi

print_success "JWT 密钥已生成"

# 交互式配置
echo ""
print_info "请选择运行环境："
echo "1) 开发环境 (development)"
echo "2) 生产环境 (production)"
read -p "请选择 (1/2) [默认: 1]: " env_choice

case $env_choice in
  2)
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' 's|NODE_ENV="development"|NODE_ENV="production"|' .env
      sed -i '' 's|LOG_LEVEL="debug"|LOG_LEVEL="info"|' .env
    else
      sed -i 's|NODE_ENV="development"|NODE_ENV="production"|' .env
      sed -i 's|LOG_LEVEL="debug"|LOG_LEVEL="info"|' .env
    fi
    print_success "已设置为生产环境"
    ;;
  *)
    print_success "已设置为开发环境"
    ;;
esac

# 配置 CORS
echo ""
read -p "请输入前端域名 [默认: http://localhost:5173]: " cors_origin
cors_origin=${cors_origin:-http://localhost:5173}

if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s|CORS_ORIGIN=.*|CORS_ORIGIN=\"${cors_origin}\"|" .env
else
  sed -i "s|CORS_ORIGIN=.*|CORS_ORIGIN=\"${cors_origin}\"|" .env
fi

print_success "CORS 已配置为: ${cors_origin}"

# 配置端口
echo ""
read -p "请输入服务器端口 [默认: 3000]: " port
port=${port:-3000}

if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s|PORT=.*|PORT=${port}|" .env
else
  sed -i "s|PORT=.*|PORT=${port}|" .env
fi

print_success "端口已配置为: ${port}"

echo ""
echo "=================================================="
print_success "环境变量配置完成！"
echo "=================================================="
echo ""
echo "配置文件位置: $(pwd)/.env"
echo ""
print_warning "请检查 .env 文件，确保所有配置正确"
echo ""
echo "下一步："
echo "  1. 检查 .env 文件内容"
echo "  2. 运行: npx prisma generate"
echo "  3. 运行: npx prisma migrate dev"
echo "  4. 运行: npm run dev"
echo ""

