# 部署指南

## 环境准备

### 1. 数据库配置

确保已安装 PostgreSQL（推荐版本 12 及以上）。

```bash
# 创建数据库
createdb stoneservers

# 或者使用 psql
psql -U postgres
CREATE DATABASE stoneservers;
```

### 2. Google OAuth 配置

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 凭据
5. 配置授权重定向 URI：
   - 开发环境: `http://localhost:3000/auth/google/callback`
   - 生产环境: `https://yourdomain.com/auth/google/callback`
6. 复制客户端 ID 和客户端密钥

### 3. Stripe 配置

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 获取 API 密钥（测试/生产）
3. 配置 Webhook：
   - URL: `https://yourdomain.com/api/subscription/webhook`
   - 监听事件：
     - `checkout.session.completed`
     - `invoice.paid`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
4. 复制 Webhook 签名密钥

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `env.example` 到 `.env` 并填写：

```bash
cp env.example .env
```

然后编辑 `.env` 文件：

```bash
# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stoneservers
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Gmail OAuth 配置
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback

# Stripe 配置
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Session 配置（生成随机字符串）
SESSION_SECRET=your_random_secret_key_here

# 前端 URL
FRONTEND_URL=https://yourdomain.com
```

### 3. 初始化数据库

```bash
npm run init-db
```

### 4. 启动服务

```bash
# 开发环境
npm run dev

# 生产环境
npm start
```

## 使用 PM2 部署（推荐）

### 安装 PM2

```bash
npm install -g pm2
```

### 启动应用

```bash
pm2 start src/server.js --name stoneservers
```

### PM2 常用命令

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs stoneservers

# 重启
pm2 restart stoneservers

# 停止
pm2 stop stoneservers

# 开机自启
pm2 startup
pm2 save
```

## 使用 Docker 部署

### 构建镜像

```bash
docker build -t stoneservers .
```

### 运行容器

```bash
docker run -d \
  --name stoneservers \
  -p 3000:3000 \
  --env-file .env \
  stoneservers
```

### Docker Compose

```bash
docker-compose up -d
```

## Nginx 反向代理配置

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL 配置（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

## 监控和日志

### 查看应用日志

```bash
# PM2
pm2 logs stoneservers

# Docker
docker logs stoneservers
```

### 数据库备份

```bash
# 备份
pg_dump -U postgres stoneservers > backup.sql

# 恢复
psql -U postgres stoneservers < backup.sql
```

## 安全建议

1. 使用 HTTPS（生产环境必须）
2. 定期更新依赖包 (`npm audit fix`)
3. 使用强随机 SESSION_SECRET
4. 启用数据库连接池
5. 配置防火墙规则
6. 定期备份数据库
7. 使用环境变量管理敏感信息
8. 启用 Stripe Webhook 签名验证
9. 限制 API 请求频率（可选）
10. 监控服务器资源使用情况

## 故障排除

### 数据库连接失败

检查：
- PostgreSQL 服务是否运行
- 数据库用户名和密码是否正确
- 数据库名称是否存在
- 防火墙规则

### OAuth 登录失败

检查：
- Google OAuth 凭据是否正确
- 回调 URL 是否匹配
- 是否启用了 Google+ API

### Webhook 接收失败

检查：
- Webhook URL 是否可访问（公网）
- Webhook 签名密钥是否正确
- 是否正确配置了监听事件

### 服务崩溃

查看日志：
```bash
pm2 logs stoneservers --lines 100
```

检查：
- 内存使用情况
- 数据库连接
- 环境变量配置

