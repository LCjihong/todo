#!/bin/bash

###############################################################################
# 前端启动脚本
###############################################################################

set -e

echo "启动 Todo 应用前端..."

cd "$(dirname "$0")/frontend"

# 检查 node_modules
if [ ! -d node_modules ]; then
  echo "安装依赖..."
  npm install
fi

# 构建前端
if [ ! -d dist ]; then
  echo "构建前端..."
  npm run build
fi

# 启动服务（使用 serve）
echo "启动服务..."
if ! command -v serve &> /dev/null; then
  echo "安装 serve..."
  npm install -g serve
fi

serve dist -l 5173

