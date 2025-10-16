#!/bin/bash

echo "🚀 部署混合架构..."

# 进入项目目录
cd /opt/Stoneservers

# 1. 停止所有 PM2 进程
echo "⏹️ 停止所有服务..."
pm2 stop all
pm2 delete all

# 2. 构建 Next.js 应用
echo "🏗️ 构建 Next.js 应用..."
npm run build

# 3. 创建日志目录
echo "📁 创建日志目录..."
mkdir -p logs

# 4. 启动混合服务
echo "🚀 启动混合服务..."
pm2 start ecosystem.config.js

# 5. 检查服务状态
echo "📊 检查服务状态..."
pm2 status

# 6. 显示日志
echo "📋 显示服务日志..."
pm2 logs --lines 10

echo "✅ 混合部署完成！"
echo "🔍 服务架构："
echo "   - 前端 (Next.js): http://localhost:3000"
echo "   - API (Express): http://localhost:3001"
echo "   - 认证路由: /auth/*"
echo "   - API 路由: /api/*"
echo ""
echo "📋 下一步："
echo "   1. 配置 Nginx 反向代理"
echo "   2. 设置域名解析"
echo "   3. 测试 Google 登录"
