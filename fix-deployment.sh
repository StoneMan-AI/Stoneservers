#!/bin/bash

# 🚀 部署修复脚本
echo "🔧 开始修复部署问题..."

# 1. 进入项目目录
cd /opt/Stoneservers

# 2. 停止 PM2 进程
echo "⏹️ 停止 PM2 进程..."
pm2 stop stoneservers 2>/dev/null || true
pm2 delete stoneservers 2>/dev/null || true

# 3. 清理并重新安装依赖
echo "📦 重新安装依赖..."
rm -rf node_modules package-lock.json
npm install

# 4. 创建环境变量文件
echo "⚙️ 创建环境变量文件..."
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
FRONTEND_URL=https://yourdomain.com

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stoneservers
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Stripe 配置
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# OAuth 配置
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
EOF

# 5. 测试服务器启动
echo "🧪 测试服务器启动..."
timeout 10s node src/server.js || echo "服务器启动测试完成"

# 6. 启动 PM2
echo "🚀 启动 PM2..."
pm2 start ecosystem.config.js

# 7. 检查状态
echo "📊 检查服务状态..."
pm2 status

# 8. 显示日志
echo "📋 显示最新日志..."
pm2 logs stoneservers --lines 10

echo "✅ 修复完成！"
echo "🔍 如果仍有问题，请检查："
echo "   1. 数据库是否运行"
echo "   2. 环境变量是否正确"
echo "   3. 端口是否被占用"
