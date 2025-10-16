#!/bin/bash

echo "🔧 修复 Next.js 构建问题..."

# 进入项目目录
cd /opt/Stoneservers

# 1. 停止 PM2 服务
echo "⏹️ 停止 PM2 服务..."
pm2 stop stoneservers 2>/dev/null || true
pm2 delete stoneservers 2>/dev/null || true

# 2. 清理构建文件
echo "🧹 清理构建文件..."
rm -rf .next
rm -rf out

# 3. 检查依赖
echo "📦 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "安装依赖..."
    npm install
fi

# 4. 创建环境变量文件
echo "⚙️ 创建环境变量..."
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
EOF

# 5. 构建 Next.js 应用
echo "🏗️ 构建 Next.js 应用..."
npm run build

# 6. 验证构建结果
echo "✅ 验证构建结果..."
if [ -f ".next/BUILD_ID" ]; then
    echo "构建成功！BUILD_ID: $(cat .next/BUILD_ID)"
else
    echo "❌ 构建失败，BUILD_ID 文件不存在"
    exit 1
fi

# 7. 启动 PM2 服务
echo "🚀 启动 PM2 服务..."
pm2 start ecosystem.config.js

# 8. 检查状态
echo "📊 检查服务状态..."
pm2 status

# 9. 显示日志
echo "📋 显示最新日志..."
pm2 logs stoneservers --lines 10

echo "✅ 修复完成！"
echo "🔍 如果仍有问题，请检查构建日志："
echo "   npm run build"
