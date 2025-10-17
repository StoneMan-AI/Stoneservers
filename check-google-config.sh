#!/bin/bash

echo "🔍 检查 Google OAuth 配置..."

# 检查环境变量
echo "=== 环境变量检查 ==="
echo "GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:-'未设置'}"
echo "GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET:-'未设置'}"
echo "GOOGLE_CALLBACK_URL: ${GOOGLE_CALLBACK_URL:-'未设置'}"

# 检查 .env 文件
echo ""
echo "=== .env 文件检查 ==="
if [ -f ".env" ]; then
    echo "✅ .env 文件存在"
    echo "Google 相关配置："
    grep -i google .env || echo "❌ 未找到 Google 配置"
else
    echo "❌ .env 文件不存在"
fi

# 检查服务状态
echo ""
echo "=== 服务状态检查 ==="
pm2 status

# 检查 API 服务日志
echo ""
echo "=== API 服务日志 ==="
pm2 logs stoneservers-api --lines 10

echo ""
echo "🔧 如果配置有问题，请按照 GOOGLE_OAUTH_SETUP.md 进行配置"
